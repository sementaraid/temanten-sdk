import { useState, useEffect } from 'react';
import type { UIStore } from '../../types';

const STORAGE_KEY = 'temanten_ui';

type PersistedState = { playAudio: boolean; darkMode: boolean };

function readStorage(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { playAudio: false, darkMode: false, ...JSON.parse(raw) };
  } catch {}
  return { playAudio: true, darkMode: false };
}

function writeStorage(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const useUIStoreImpl = (): UIStore => {
  const [playAudio, setPlayAudio] = useState(() => readStorage().playAudio);
  const [screenState, setScreenState] = useState<'welcome' | 'main'>('welcome');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => readStorage().darkMode);

  useEffect(() => {
    writeStorage({ playAudio, darkMode });
  }, [playAudio, darkMode]);

  return {
    playAudio,
    screenState,
    drawerOpen,
    darkMode,
    setPlayAudio,
    setScreenState,
    setDrawerOpen,
    setDarkMode,
  };
};
