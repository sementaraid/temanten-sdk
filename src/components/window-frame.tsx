import { useSyncExternalStore, type ReactNode } from 'react';
import { useUIStore } from '../context/index';

const subscribe = () => () => { };
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export type WindowFrameProps = { children: ReactNode };

export const WindowFrame = ({ children }: WindowFrameProps) => {
  const isClient = useIsClient();
  const { darkMode } = useUIStore();

  if (!isClient) return null;

  return (
    <div
      className={darkMode ? 'dark' : ''}
      style={{ width: '100%', margin: 'auto', position: 'relative', maxWidth: '640px' }}
    >
      {children}
    </div>
  );
};
