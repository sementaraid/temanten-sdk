import { useEffect, useRef } from 'react';
import { useUIStore } from '../context/index';

export const Audio = () => {
  const { playAudio } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playAudio) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playAudio]);

  return (
    <audio ref={audioRef} src="/music/pawestri_cut.mp3" loop preload="auto" className="hidden" />
  );
};
