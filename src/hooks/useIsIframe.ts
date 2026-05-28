import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export const useIsIframe = () =>
  useSyncExternalStore(
    subscribe,
    () => window.self !== window.top,
    () => false
  );
