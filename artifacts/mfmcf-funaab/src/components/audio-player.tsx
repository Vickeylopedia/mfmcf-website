import { useRef, useState, useEffect, type MouseEvent } from "react";
import {
  Check,
  Download,
  Headphones,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Eyebrow } from "@/components/foundation";
import { downloadSermonWithArtwork } from "@/lib/audio-downloader";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export interface AudioPlayerProps {
  src: string;
  title: string;
  speaker: string;
  artworkUrl: string;
  scripture?: string;
  date?: string;
}

export function AudioPlayer({
  src,
  title,
  speaker,
  artworkUrl,
  scripture,
  date,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  // Speed options
  const speeds = [1, 1.25, 1.5, 2];

  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn("Audio play prevented or file unavailable", err);
      });
    } else {
      audio.pause();
    }
  };

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrent(newTime);
  };

  const skip = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(Math.max(audio.currentTime + deltaSeconds, 0), duration || 9999);
    audio.currentTime = next;
    setCurrent(next);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    setIsMuted(next);
    audio.muted = next;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadDone(false);

    try {
      await downloadSermonWithArtwork({
        title,
        speaker,
        audioSrc: src,
        artworkUrl,
      });
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 4000);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const progress = duration > 0 ? Math.min(current / duration, 1) : 0;

  return (
    <div className="border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-[6px_6px_0px_hsl(var(--foreground))]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(var(--foreground)/.12)] pb-4">
        <div>
          <Eyebrow weight="bold">Official Sermon Audio</Eyebrow>
          <p className="mt-1 font-mono text-[11px] font-bold text-[hsl(var(--muted-foreground))]">
            {date || "MFMCF FUNAAB Archives"} {scripture && `· ${scripture}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 border border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-[hsl(var(--primary))]">
            <Headphones className="size-3" />
            Full Message
          </span>
        </div>
      </div>

      {/* Main Player Display */}
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Cover Art Thumbnail with Play Status Indicator */}
        <div className="relative size-24 shrink-0 overflow-hidden border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] shadow-[3px_3px_0px_hsl(var(--foreground))] sm:size-28">
          <img
            src={artworkUrl}
            alt={title}
            className={`size-full object-cover transition-transform duration-700 ${
              playing ? "scale-105" : "scale-100"
            }`}
          />
          {playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
              <div className="flex items-end gap-1">
                <span className="h-4 w-1 animate-pulse bg-[hsl(var(--accent))]" />
                <span className="h-6 w-1 animate-pulse bg-white [animation-delay:150ms]" />
                <span className="h-3 w-1 animate-pulse bg-[hsl(var(--accent))] [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Title, Speaker & Waveform */}
        <div className="min-w-0 flex-1">
          <p className="mono-label text-[9px] text-[hsl(var(--muted-foreground))]">
            {playing ? "Now playing" : "Listen to the word"}
          </p>
          <h3 className="display-font mt-1 truncate text-2xl font-bold leading-tight text-[hsl(var(--foreground))]">
            {title}
          </h3>
          <p className="mt-0.5 truncate text-sm font-semibold text-[hsl(var(--muted-foreground))]">
            {speaker}
          </p>

          {/* Interactive Scrub Bar */}
          <div className="mt-4">
            <div
              ref={barRef}
              onClick={seek}
              role="progressbar"
              aria-label="Seek track position"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(current)}
              className="group relative flex h-3 cursor-pointer items-center border border-[hsl(var(--foreground)/.25)] bg-[hsl(var(--foreground)/.08)] px-0.5 transition-all hover:h-4"
              data-testid="progressbar-sermon-audio"
            >
              <div
                className="h-full bg-[hsl(var(--primary))] transition-[width] duration-100 group-hover:bg-[hsl(var(--accent))]"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="size-3.5 -translate-x-1/2 border-2 border-[hsl(var(--foreground))] bg-white opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
              <span>{formatTime(current)}</span>
              <span>{duration > 0 ? formatTime(duration) : "35:00"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[hsl(var(--foreground)/.12)] pt-6">
        <div className="flex items-center gap-3">
          {/* Skip -10s */}
          <button
            type="button"
            onClick={() => skip(-10)}
            title="Rewind 10 seconds"
            className="flex size-10 items-center justify-center border-2 border-[hsl(var(--foreground))] bg-white text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--secondary))]"
          >
            <RotateCcw className="size-4" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? `Pause ${title}` : `Play ${title}`}
            data-testid="button-sermon-play-audio"
            className="flex h-12 items-center gap-2.5 border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] px-6 font-mono text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
          >
            {playing ? (
              <>
                <Pause className="size-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                <span>Play Sermon</span>
              </>
            )}
          </button>

          {/* Skip +10s */}
          <button
            type="button"
            onClick={() => skip(10)}
            title="Forward 10 seconds"
            className="flex size-10 items-center justify-center border-2 border-[hsl(var(--foreground))] bg-white text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--secondary))]"
          >
            <RotateCw className="size-4" />
          </button>

          {/* Speed Selector */}
          <button
            type="button"
            onClick={cycleSpeed}
            title="Change playback speed"
            className="border-2 border-[hsl(var(--foreground))] bg-white px-2.5 py-2 font-mono text-[11px] font-bold text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--secondary))]"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Volume & Download Section */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))]"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-20 cursor-pointer accent-[hsl(var(--primary))]"
              aria-label="Volume slider"
            />
          </div>

          {/* Download with embedded artwork */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            data-testid="link-sermon-download"
            className="group flex items-center gap-2 border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[3px_3px_0px_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-white"
            title="Download full sermon MP3 with embedded cover artwork"
          >
            {downloading ? (
              <>
                <Loader2 className="size-4 animate-spin text-[hsl(var(--primary))]" />
                <span>Preparing MP3…</span>
              </>
            ) : downloadDone ? (
              <>
                <Check className="size-4 text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                <span>Download Audio + Art</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[hsl(var(--foreground)/.08)] pt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
        <span className="font-mono">✓ Embedded album artwork included in MP3</span>
        <span className="font-mono font-bold text-[hsl(var(--primary))]">High Definition Audio</span>
      </div>

      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          if (e.currentTarget.duration && !Number.isNaN(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
