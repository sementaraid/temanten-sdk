import { useState } from 'react';
import type { UIStore } from '../../types';

export const useUIStoreImpl = (): UIStore => {
  const [playAudio, setPlayAudio] = useState(false);
  const [screenState, setScreenState] = useState<'welcome' | 'main'>('welcome');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
