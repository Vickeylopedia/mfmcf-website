import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useAudio } from "@/lib/audio-context";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function FloatingAudioPlayer() {
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    isMiniOpen,
    setIsMiniOpen,
    togglePlay,
    seek,
    skip,
    setRate,
    toggleMute,
  } = useAudio();

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const autoMinimizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-minimize after 10 seconds of no user interaction
  const resetAutoMinimizeTimer = () => {
    if (autoMinimizeTimerRef.current) {
      clearTimeout(autoMinimizeTimerRef.current);
    }
    autoMinimizeTimerRef.current = setTimeout(() => {
      setIsMiniOpen(false);
    }, 10000);
  };

  useEffect(() => {
    if (isMiniOpen) {
      resetAutoMinimizeTimer();
    }
    return () => {
      if (autoMinimizeTimerRef.current) {
        clearTimeout(autoMinimizeTimerRef.current);
      }
    };
  }, [isMiniOpen]);

  // Don't render anything if no sermon has been played yet
  if (!track) return null;

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    resetAutoMinimizeTimer();
    const bar = progressBarRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    seek(ratio * duration);
  };

  const handleAction = (callback: () => void) => {
    resetAutoMinimizeTimer();
    callback();
  };

  const speeds = [1, 1.25, 1.5, 2];
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setRate(speeds[nextIdx]);
  };

  return (
    <aside
      aria-label="Audio player"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 select-none"
      onMouseMove={() => {
        if (isMiniOpen) resetAutoMinimizeTimer();
      }}
    >
      <AnimatePresence mode="wait">
        {!isMiniOpen ? (
          /* ── FLOATING ROUND BUTTON (Slightly faded, transparent, innovative spinning vinyl + live soundwaves) ── */
          <motion.button
            key="round-floating-btn"
            type="button"
            onClick={() => setIsMiniOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.82 }}
            whileHover={{ scale: 1.08, opacity: 1 }}
            whileTap={{ scale: 0.94 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="group relative flex size-15 sm:size-16 items-center justify-center rounded-full border-2 border-[hsl(var(--accent))] bg-[hsl(var(--foreground)/.85)] p-1 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300"
            title={`Now playing: ${track.title} | Tap to expand controls`}
            aria-label="Open mini sermon player"
          >
            {/* Pulsing Accent Glow Ring */}
            {isPlaying && (
              <span className="absolute -inset-1.5 rounded-full border border-[hsl(var(--accent)/.6)] animate-ping pointer-events-none" />
            )}

            {/* Spinning Mini Vinyl Album Disc */}
            <div
              className={`relative size-full overflow-hidden rounded-full border border-white/20 shadow-inner ${
                isPlaying ? "animate-[spin_9s_linear_infinite]" : ""
              }`}
            >
              <img
                src={track.artworkUrl}
                alt={track.title}
                className="size-full object-cover"
              />

              {/* Vinyl Groove Rings & Center Spindle Pin */}
              <div className="pointer-events-none absolute inset-0 rounded-full border-[3px] border-black/40" />
              <div className="pointer-events-none absolute inset-2 rounded-full border border-white/20" />
              <div className="absolute inset-0 m-auto size-3.5 rounded-full border border-white/60 bg-[hsl(var(--accent))] shadow-[0_0_6px_hsl(var(--accent))]" />
            </div>

            {/* Innovative Dancing Soundwaves Overlay in the Center */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-0.5 bg-black/35 rounded-full backdrop-blur-[0.5px]">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className={`w-0.5 rounded-full bg-[hsl(var(--accent))] ${
                    isPlaying ? "animate-pulse" : "h-1"
                  }`}
                  style={{
                    height: isPlaying
                      ? `${10 + ((bar * 5) % 12)}px`
                      : "4px",
                    animationDuration: `${0.45 + bar * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Hover tooltip / indicator icon */}
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-md">
              {isPlaying ? (
                <Pause className="size-2.5 fill-current" />
              ) : (
                <Play className="size-2.5 fill-current ml-0.5" />
              )}
            </span>
          </motion.button>
        ) : (
          /* ── EXPANDED MINI CONTROLLER CARD (Auto-minimizes after 10s) ── */
          <motion.div
            key="expanded-mini-player"
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="w-[90vw] max-w-[340px] sm:max-w-[370px] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] p-4 shadow-[5px_5px_0px_hsl(var(--foreground))] sm:p-5"
          >
            {/* Top Bar: Thumbnail, Details, and Minimize Button */}
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden border border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]">
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className={`size-full object-cover ${
                    isPlaying ? "scale-105" : ""
                  }`}
                />
                {isPlaying && (
                  <span className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-[hsl(var(--accent))] animate-ping" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="mono-label text-[8px] font-bold text-[hsl(var(--primary))] uppercase">
                  {isPlaying ? "Playing sermon" : "Paused"}
                </p>
                <h4 className="display-font text-sm font-bold leading-tight text-[hsl(var(--foreground))] truncate">
                  {track.title}
                </h4>
                <p className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] truncate">
                  {track.speaker}
                </p>
              </div>

              {/* Minimize to Round Button */}
              <button
                type="button"
                onClick={() => setIsMiniOpen(false)}
                title="Minimize player"
                className="flex size-7 items-center justify-center border border-[hsl(var(--foreground)/.25)] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))] hover:bg-white"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>

            {/* Interactive Seek Progress Bar */}
            <div className="mt-3.5">
              <div
                ref={progressBarRef}
                onClick={handleProgressBarClick}
                role="progressbar"
                aria-label="Seek track position"
                aria-valuenow={Math.round(currentTime)}
                className="group relative flex h-2.5 cursor-pointer items-center border border-[hsl(var(--foreground)/.2)] bg-[hsl(var(--foreground)/.08)] px-0.5 transition-all hover:h-3"
              >
                <div
                  className="h-full bg-[hsl(var(--primary))] transition-[width] duration-100 group-hover:bg-[hsl(var(--accent))]"
                  style={{ width: `${progress * 100}%` }}
                />
                <div
                  className="size-3 -translate-x-1/2 border border-[hsl(var(--foreground))] bg-white opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ left: `${progress * 100}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between font-mono text-[9px] font-bold text-[hsl(var(--muted-foreground))]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="mt-3 flex items-center justify-between border-t border-[hsl(var(--foreground)/.1)] pt-3">
              <div className="flex items-center gap-1.5">
                {/* Skip -10s */}
                <button
                  type="button"
                  onClick={() => handleAction(() => skip(-10))}
                  title="Rewind 10s"
                  className="flex size-8 items-center justify-center border border-[hsl(var(--foreground))] bg-white text-[hsl(var(--foreground))] shadow-[1px_1px_0px_hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
                >
                  <RotateCcw className="size-3" />
                </button>

                {/* Big Play / Pause */}
                <button
                  type="button"
                  onClick={() => handleAction(togglePlay)}
                  aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                  className="flex h-8 items-center gap-1.5 border border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] px-3.5 font-mono text-[10px] font-black uppercase text-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="size-3 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Skip +10s */}
                <button
                  type="button"
                  onClick={() => handleAction(() => skip(10))}
                  title="Forward 10s"
                  className="flex size-8 items-center justify-center border border-[hsl(var(--foreground))] bg-white text-[hsl(var(--foreground))] shadow-[1px_1px_0px_hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
                >
                  <RotateCw className="size-3" />
                </button>

                {/* Speed Toggle */}
                <button
                  type="button"
                  onClick={() => handleAction(cycleSpeed)}
                  title="Change playback speed"
                  className="flex h-8 items-center justify-center border border-[hsl(var(--foreground))] bg-white px-2 font-mono text-[9px] font-bold text-[hsl(var(--foreground))] shadow-[1px_1px_0px_hsl(var(--foreground))]"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Mute and Details Link */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(toggleMute)}
                  className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="size-3.5" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                </button>

                {track.slug && (
                  <Link
                    href={`/sermons/${track.slug}`}
                    className="flex size-7 items-center justify-center text-[hsl(var(--primary))] hover:text-[hsl(var(--foreground))]"
                    title="View sermon details"
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Auto-minimize indicator badge */}
            <p className="mt-2 text-center font-mono text-[8px] text-[hsl(var(--muted-foreground)/.7)]">
              Minimizes automatically in 10s
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
