import { useEffect, useRef } from 'react';
import { useUIStore } from '../context/index';

export type AudioProps = { src?: string };

export const Audio = ({ src }: AudioProps) => {
  const { playAudio } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playAudio) {
      audio.volume = 1;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playAudio]);

  if (!src) return null;

  return <audio ref={audioRef} src={src} loop preload="auto" className="hidden" />;
};
