/**
 * Utility to download sermon audio with embedded ID3v2 cover artwork.
 * This embeds the sermon artwork directly into the MP3 file's ID3v2.3 APIC frame,
 * so media players (Apple Music, Android, Windows, VLC, car players) display
 * the cover artwork natively on screen.
 */

function encodeSyncSafe(size: number): number[] {
  return [
    (size >> 21) & 0x7f,
    (size >> 14) & 0x7f,
    (size >> 7) & 0x7f,
    size & 0x7f,
  ];
}

function createTextFrame(frameId: string, text: string): Uint8Array {
  const textBytes = new TextEncoder().encode(text);
  const data = new Uint8Array(1 + textBytes.length);
  data[0] = 3; // UTF-8
  data.set(textBytes, 1);

  const frame = new Uint8Array(10 + data.length);
  for (let i = 0; i < 4; i++) frame[i] = frameId.charCodeAt(i);
  frame[4] = (data.length >> 24) & 0xff;
  frame[5] = (data.length >> 16) & 0xff;
  frame[6] = (data.length >> 8) & 0xff;
  frame[7] = data.length & 0xff;
  frame[8] = 0;
  frame[9] = 0;
  frame.set(data, 10);
  return frame;
}

function createApicFrame(
  imageBytes: Uint8Array,
  mimeType = "image/jpeg",
): Uint8Array {
  const mimeBytes = new TextEncoder().encode(mimeType);
  const descBytes = new TextEncoder().encode("Cover");
  const headerLen = 1 + mimeBytes.length + 1 + 1 + descBytes.length + 1;
  const data = new Uint8Array(headerLen + imageBytes.length);

  let offset = 0;
  data[offset++] = 0; // ISO-8859-1 for text description
  data.set(mimeBytes, offset);
  offset += mimeBytes.length;
  data[offset++] = 0; // null separator
  data[offset++] = 3; // Picture type: Cover (front)
  data.set(descBytes, offset);
  offset += descBytes.length;
  data[offset++] = 0; // null separator
  data.set(imageBytes, offset);

  const frame = new Uint8Array(10 + data.length);
  frame.set([0x41, 0x50, 0x49, 0x43]); // 'APIC'
  frame[4] = (data.length >> 24) & 0xff;
  frame[5] = (data.length >> 16) & 0xff;
  frame[6] = (data.length >> 8) & 0xff;
  frame[7] = data.length & 0xff;
  frame[8] = 0;
  frame[9] = 0;
  frame.set(data, 10);
  return frame;
}

function buildId3Tag(frames: Uint8Array[]): Uint8Array {
  const totalFramesLen = frames.reduce((acc, f) => acc + f.length, 0);
  const tag = new Uint8Array(10 + totalFramesLen);
  tag[0] = 0x49; // 'I'
  tag[1] = 0x44; // 'D'
  tag[2] = 0x33; // '3'
  tag[3] = 3; // ID3v2.3
  tag[4] = 0;
  tag[5] = 0;
  const syncSafe = encodeSyncSafe(totalFramesLen);
  tag[6] = syncSafe[0];
  tag[7] = syncSafe[1];
  tag[8] = syncSafe[2];
  tag[9] = syncSafe[3];

  let offset = 10;
  for (const f of frames) {
    tag.set(f, offset);
    offset += f.length;
  }
  return tag;
}

async function imageToJpegBytes(imageUrl: string): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width || 600;
        let height = img.height || 600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          async (blob) => {
            if (!blob) return resolve(null);
            const arrayBuffer = await blob.arrayBuffer();
            resolve(new Uint8Array(arrayBuffer));
          },
          "image/jpeg",
          0.9,
        );
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export interface SermonDownloadOptions {
  title: string;
  speaker: string;
  audioSrc: string;
  artworkUrl: string;
}

export async function downloadSermonWithArtwork({
  title,
  speaker,
  audioSrc,
  artworkUrl,
}: SermonDownloadOptions): Promise<{ success: boolean; hasEmbeddedArt: boolean }> {
  const safeFilename = `${title.replace(/[/\\?%*:|"<>]/g, "-")} - ${speaker.replace(/[/\\?%*:|"<>]/g, "-")}.mp3`;

  try {
    // 1. Fetch audio buffer
    const audioRes = await fetch(audioSrc);
    if (!audioRes.ok) throw new Error("Audio download failed");
    const audioArrayBuffer = await audioRes.arrayBuffer();
    const audioBytes = new Uint8Array(audioArrayBuffer);

    // 2. Fetch & convert artwork
    let imageBytes: Uint8Array | null = null;
    if (artworkUrl) {
      imageBytes = await imageToJpegBytes(artworkUrl);
    }

    // 3. Build ID3 frames
    const frames: Uint8Array[] = [
      createTextFrame("TIT2", title),
      createTextFrame("TPE1", speaker),
      createTextFrame("TALB", "MFMCF FUNAAB Sermons"),
    ];

    if (imageBytes && imageBytes.length > 0) {
      frames.push(createApicFrame(imageBytes, "image/jpeg"));
    }

    const id3Tag = buildId3Tag(frames);

    // 4. Strip existing ID3 header if present
    let cleanAudioOffset = 0;
    if (
      audioBytes[0] === 0x49 &&
      audioBytes[1] === 0x44 &&
      audioBytes[2] === 0x33
    ) {
      const existingSize =
        ((audioBytes[6] & 0x7f) << 21) |
        ((audioBytes[7] & 0x7f) << 14) |
        ((audioBytes[8] & 0x7f) << 7) |
        (audioBytes[9] & 0x7f);
      cleanAudioOffset = 10 + existingSize;
    }

    // Combine ID3 tag + audio data
    const finalBuffer = new Uint8Array(
      id3Tag.length + (audioBytes.length - cleanAudioOffset),
    );
    finalBuffer.set(id3Tag, 0);
    finalBuffer.set(audioBytes.subarray(cleanAudioOffset), id3Tag.length);

    const blob = new Blob([finalBuffer], { type: "audio/mpeg" });
    triggerFileDownload(blob, safeFilename);

    return { success: true, hasEmbeddedArt: Boolean(imageBytes) };
  } catch (err) {
    console.warn("Direct embedding failed; falling back to direct download", err);

    // Direct audio download
    const audioLink = document.createElement("a");
    audioLink.href = audioSrc;
    audioLink.download = safeFilename;
    audioLink.target = "_blank";
    document.body.appendChild(audioLink);
    audioLink.click();
    document.body.removeChild(audioLink);

    // Also download artwork companion if available
    if (artworkUrl) {
      const artLink = document.createElement("a");
      artLink.href = artworkUrl;
      artLink.download = `${title} - Cover.jpg`;
      artLink.target = "_blank";
      document.body.appendChild(artLink);
      artLink.click();
      document.body.removeChild(artLink);
    }

    return { success: true, hasEmbeddedArt: false };
  }
}
