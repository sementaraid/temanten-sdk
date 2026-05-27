import type React from 'react';
import type {
  TemantenContextType,
  TemantenStore,
  UIStore,
  InvitationStoreBase,
  UIState,
} from './types';
import type { Dispatch, SetStateAction, ReactNode } from 'react';

export type * from './types';

// ─── SDK interface ────────────────────────────────────────────────────────────
// The host app populates globalThis.__TEMANTEN_SDK__ before loading any template
// bundle. Templates access hooks and shared components through this object.

export interface TemantenSDK {
  // Hooks
  useTemantenState(): TemantenContextType;
  useTemantenStore(): TemantenStore;
  useUIStore(): UIStore;
  useInvitationStore(): InvitationStoreBase;
  useTemantenSetter(): Dispatch<SetStateAction<UIState>>;

  // Shared components
  WindowFrame: React.ComponentType<{ children: ReactNode }>;
  Audio: React.ComponentType;
  SnowfallEffect: React.ComponentType;
}

declare global {
  // eslint-disable-next-line no-var
  var __TEMANTEN_SDK__: TemantenSDK;
}

// ─── Hook wrappers ────────────────────────────────────────────────────────────
// These are valid React hooks (prefixed with `use`). They delegate to the host
// app's implementations which have the correct React context in their closure.
// Safe to bundle into template UMD — they're tiny and have no React dep of their own.

export const useTemantenState = (): TemantenContextType =>
  globalThis.__TEMANTEN_SDK__.useTemantenState();

export const useTemantenStore = (): TemantenStore =>
  globalThis.__TEMANTEN_SDK__.useTemantenStore();

export const useUIStore = (): UIStore =>
  globalThis.__TEMANTEN_SDK__.useUIStore();

export const useInvitationStore = (): InvitationStoreBase =>
  globalThis.__TEMANTEN_SDK__.useInvitationStore();

export const useTemantenSetter = (): Dispatch<SetStateAction<UIState>> =>
  globalThis.__TEMANTEN_SDK__.useTemantenSetter();

// ─── Component wrappers ───────────────────────────────────────────────────────
// Stable function references that proxy to host-provided components.
// React sees the same component type on every render (no spurious remounts).

export const WindowFrame: React.FC<{ children: ReactNode }> = (props) =>
  (globalThis.__TEMANTEN_SDK__.WindowFrame as React.FC<{ children: ReactNode }>)(props);

export const Audio: React.FC = () =>
  (globalThis.__TEMANTEN_SDK__.Audio as React.FC)({});

export const SnowfallEffect: React.FC = () =>
  (globalThis.__TEMANTEN_SDK__.SnowfallEffect as React.FC)({});
