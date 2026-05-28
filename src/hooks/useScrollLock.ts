import { useEffect } from 'react';
import { useTemantenStore } from '../context/index';

export function useScrollLock(shouldLock: boolean) {
  const { mode } = useTemantenStore();

  useEffect(() => {
    if (mode === 'demo') return;

    if (shouldLock) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [shouldLock, mode]);
}
