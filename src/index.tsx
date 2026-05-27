// ─── Types & constants ────────────────────────────────────────────────────────
export type * from './types';
export { DEFAULT_INVITATION_DATA } from './constant';

// ─── Provider & hooks ─────────────────────────────────────────────────────────
export {
  TemantenProvider,
  useTemantenStore,
  useUIStore,
  useInvitationStore,
  useTemantenState,
  useTemantenSetter,
} from './context/index';
export type { TemantenProviderProps } from './context/index';

// ─── Shared components ────────────────────────────────────────────────────────
// Templates import these from @temanten/sdk at build time.
// At runtime the UMD bundle resolves them from window.TemantenSDK, which the
// host app populates with this very module — so all components share the same
// React context and instance as the host app.
export { WindowFrame } from './components/window-frame';
export type { WindowFrameProps } from './components/window-frame';
export { Audio } from './components/audio';
export type { AudioProps } from './components/audio';
export { SnowfallEffect } from './components/snowfall';
