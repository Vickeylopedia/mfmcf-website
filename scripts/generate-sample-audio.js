import fs from "node:fs";
import path from "node:path";

const sampleRate = 22050;
const durationSec = 35;
const numSamples = sampleRate * durationSec;
const byteRate = sampleRate * 2;
const dataSize = numSamples * 2;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);

// fmt chunk
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);

// data chunk
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

// Warm piano/pad chord progression in D major
const chords = [
  [146.83, 185.0, 220.0],
  [196.0, 246.94, 293.66],
  [123.47, 146.83, 220.0],
  [110.0, 164.81, 220.0],
];

let offset = 44;
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const chordIdx = Math.floor(t / 8) % chords.length;
  const chord = chords[chordIdx];
  const chordT = t % 8;
  const env =
    Math.min(chordT / 1.2, 1) * Math.max(0, 1 - Math.max(0, chordT - 6.5) / 1.5);

  let sample = 0;
  for (let c = 0; c < chord.length; c++) {
    const freq = chord[c];
    sample += Math.sin(2 * Math.PI * freq * t) * 0.45;
    sample += Math.sin(2 * Math.PI * (freq * 2) * t) * 0.2;
    sample += Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.35;
  }
  sample = (sample / chord.length) * env * 0.7;
  const intSample = Math.max(
    -32767,
    Math.min(32767, Math.floor(sample * 32767)),
  );
  buffer.writeInt16LE(intSample, offset);
  offset += 2;
}

const outDir = path.join(
  "artifacts",
  "mfmcf-funaab",
  "public",
  "assets",
  "audio",
);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sample-sermon.mp3"), buffer);
fs.writeFileSync(path.join(outDir, "sample-sermon.wav"), buffer);
console.log("Sample audio created successfully in", outDir);
