import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

export interface AudioTrack {
  src: string;
  title: string;
  speaker: string;
  artworkUrl: string;
  scripture?: string;
  date?: string;
  slug?: string;
}

interface AudioContextType {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isMiniOpen: boolean;
  setIsMiniOpen: (open: boolean) => void;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  skip: (deltaSeconds: number) => void;
  setRate: (rate: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMiniOpen, setIsMiniOpen] = useState(false);

  const playTrack = (newTrack: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If it's already the current track, toggle playback
    if (track && track.src === newTrack.src) {
      if (audio.paused) {
        audio.play().catch(() => {});
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Switch to new track
    setTrack(newTrack);
    setCurrentTime(0);
    setDuration(0);
    audio.src = newTrack.src;
    audio.playbackRate = playbackRate;
    audio.load();
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.warn("Audio auto-play prevented or file error", err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(time, duration || 9999));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const skip = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.max(0, Math.min(audio.currentTime + deltaSeconds, duration || 9999));
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const setRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        track,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        isMuted,
        isMiniOpen,
        setIsMiniOpen,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        skip,
        setRate,
        setVolume,
        toggleMute,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => {
          if (
            e.currentTarget.duration &&
            Number.isFinite(e.currentTarget.duration) &&
            e.currentTarget.duration > 0
          ) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onDurationChange={(e) => {
          if (
            e.currentTarget.duration &&
            Number.isFinite(e.currentTarget.duration) &&
            e.currentTarget.duration > 0
          ) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return ctx;
}
