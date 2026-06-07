import { useEffect, useRef } from 'react';
import { useUIStore } from '../context/index';

export type AudioProps = { src: string };

export const Audio = ({ src }: AudioProps) => {
  const { playAudio } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playAudio) {
      audio.volume = 1;
      if (!hasStarted.current) {
        audio.play().catch(() => {});
        hasStarted.current = true;
      }
    } else {
      audio.volume = 0;
    }
  }, [playAudio]);

  return <audio ref={audioRef} src={src} loop preload="auto" className="hidden" />;
};
