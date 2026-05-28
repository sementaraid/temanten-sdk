import { type ReactNode } from 'react';
import { useUIStore } from '../context/index';

export type WindowTemplateProps = { 
  children: ReactNode
  className?: string
};

export const WindowTemplate = ({ children, className }: WindowTemplateProps) => {
  const { screenState } = useUIStore();

  const classNames = ['temanten-template', className].filter(Boolean).join(' ');
  return (
      <div
        className={classNames}
        style={
          screenState === 'welcome'
            ? { overflow: 'hidden', height: '100vh' }
            : undefined
        }
      >
        {children}
      </div>
  );
};
