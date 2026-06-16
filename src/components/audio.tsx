import { useEffect, useRef } from 'react';
import { useUIStore } from '../context/index';

export type AudioProps = { src?: string };

export const Audio = ({ src }: AudioProps) => {
  const { playAudio, setPlayAudio } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync external pause/play signals (iOS system bar, browser media controls)
  // back into the store so the floating controls reflect the real state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPause = () => setPlayAudio(false);
    const onPlay  = () => setPlayAudio(true);

    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, [setPlayAudio]);

  // Drive the audio element from store state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let retry: (() => void) | null = null;

    if (playAudio) {
      audio.volume = 1;
      audio.play().catch(() => {
        // Browser blocked autoplay (no user gesture yet).
        // Retry on the next click — covers the case where playAudio was true
        // from localStorage on reload and the state never changes when the
        // user clicks "Buka Undangan".
        retry = () => audio.play().catch(() => {});
        document.addEventListener('click', retry, { once: true });
      });
    } else {
      audio.pause();
    }

    return () => {
      if (retry) document.removeEventListener('click', retry);
    };
  }, [playAudio]);

  if (!src) return null;

  return <audio ref={audioRef} src={src} loop preload="auto" className="hidden" />;
};
