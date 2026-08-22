import { useRef, useState, type MouseEvent } from "react";
import { Pause, Play } from "lucide-react";
import { Eyebrow } from "@/components/foundation";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/**
 * Sermon audio player. The src convention is /assets/audio/<slug>.mp3 —
 * drop recordings into public/assets/audio and the player activates for
 * that sermon; until a file exists it falls back to the request-a-copy
 * panel instead of pretending to play.
 */
export function AudioPlayer({
  src,
  title,
  requestHref,
}: {
  src: string;
  title: string;
  requestHref: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setAvailable(false));
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
    audio.currentTime = ratio * duration;
    setCurrent(audio.currentTime);
  };

  if (available === false) {
    return (
      <div className="border border-[hsl(var(--foreground)/.16)] bg-[hsl(var(--card))] p-6 sm:p-8">
        <Eyebrow>The recording</Eyebrow>
        <p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          This message is not in the audio archive yet. Ask for it and we
          will send the recording your way, usually within a day.
        </p>
        <a
          href={requestHref}
          data-testid="link-sermon-request-recording"
          className="group mt-7 inline-flex items-center gap-3 border border-[hsl(var(--primary))] bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-transparent hover:text-[hsl(var(--primary))]"
        >
          Request this recording
        </a>
      </div>
    );
  }

  const progress = duration ? Math.min(current / duration, 1) : 0;

  return (
    <div className="border border-[hsl(var(--foreground)/.16)] bg-[hsl(var(--card))] p-6 sm:p-8">
      <Eyebrow>The recording</Eyebrow>
      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          data-testid="button-sermon-play-audio"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="ml-0.5 size-5 fill-current" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="mono-label text-[9px] text-[hsl(var(--muted-foreground))]">
            {playing ? "Now playing" : "Listen here"}
          </p>
          <p className="mt-1 truncate text-sm font-bold">{title}</p>
          <div
            ref={barRef}
            onClick={seek}
            role="progressbar"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            className="mt-3 flex h-1.5 cursor-pointer items-center bg-[hsl(var(--foreground)/.15)]"
            data-testid="progressbar-sermon-audio"
          >
            <div
              className="h-full bg-[hsl(var(--primary))] transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mono-label mt-2 text-[9px] text-[hsl(var(--muted-foreground))]">
            {formatTime(current)} / {formatTime(duration)}
          </p>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onError={() => setAvailable(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setAvailable(true);
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
