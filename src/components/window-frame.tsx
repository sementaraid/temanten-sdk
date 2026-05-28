import { useSyncExternalStore, type ReactNode } from 'react';
import { useUIStore } from '../context/index';

const subscribe = () => () => { };
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export type WindowFrameProps = { 
  children: ReactNode
  className?: string
};

export const WindowFrame = ({ children, className }: WindowFrameProps) => {
  const isClient = useIsClient();
  const { darkMode } = useUIStore();

  const classNames = [
    'temanten-frame', 
    darkMode ? 'dark' : '', 
    className
  ].filter(Boolean).join(' ');

  if (!isClient) return null;

  return (
    <div
      className={classNames}
    >
      {children}
    </div>
  );
};
