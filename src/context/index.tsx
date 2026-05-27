/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useUIStoreImpl } from './stores/ui.store';
import { useLiveInvitationStoreImpl, useMockInvitationStoreImpl } from './stores/invitation.store';
import { useGuestStoreImpl } from './stores/guest.store';
import type {
  InvitationData,
  TemantenStore,
  InvitationStoreBase,
  UIStore,
  TemantenContextType,
  UIState,
} from '../types';

const TemantenContext = createContext<TemantenStore | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export type TemantenProviderProps = (
  | {
      mode: 'live';
      /** The guest's ID from the invitation URL (`?guest_id=`). */
      guestId?: string;
      /** Pre-fetched invitation data — avoids an extra network round-trip. */
      initialData?: InvitationData;
    }
  | {
      mode: 'demo';
      /** Seed data for the demo. Falls back to the default "Budi & Putri" placeholder. */
      initialData?: InvitationData;
    }
) & { children: ReactNode };

/**
 * The single source of truth for all template components.
 *
 * Wrap any template in `TemantenProvider` and every component inside gets
 * access to invitation data, UI state, and guest info — all via hooks,
 * with no prop drilling.
 *
 * Modes:
 * - **`live`** — a real guest is viewing a published invitation. Polls for
 *   comments every 10 seconds. `initialData` should be the pre-fetched invitation.
 * - **`demo`** — shows the template with placeholder (or seed) data.
 *   No network requests are made.
 */
export const TemantenProvider = (props: TemantenProviderProps) => {
  const ui = useUIStoreImpl();

  const liveInvitation = useLiveInvitationStoreImpl(
    props.mode === 'live' ? props.initialData : undefined
  );
  const mockInvitation = useMockInvitationStoreImpl(
    props.mode === 'demo' ? props.initialData : undefined
  );

  const guest = useGuestStoreImpl(
    props.mode === 'live' ? (props.initialData?.id ?? null) : null,
    props.mode === 'live' ? (props.guestId ?? null) : null
  );

  const invitation: InvitationStoreBase =
    props.mode === 'live' ? liveInvitation : mockInvitation;

  return (
    <TemantenContext.Provider value={{ mode: props.mode, ui, invitation, guest }}>
      {props.children}
    </TemantenContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useTemantenStore = (): TemantenStore => {
  const ctx = useContext(TemantenContext);
  if (ctx === undefined) throw new Error('useTemantenStore must be used within TemantenProvider');
  return ctx;
};

export const useUIStore = (): UIStore => useTemantenStore().ui;

export const useInvitationStore = (): InvitationStoreBase => useTemantenStore().invitation;

// ─── Backward-compatible hooks ────────────────────────────────────────────────

/** @deprecated Prefer `useUIStore()` and `useInvitationStore()`. */
export const useTemantenState = (): TemantenContextType => {
  const { ui, invitation } = useTemantenStore();
  return {
    playAudio: ui.playAudio,
    screenState: ui.screenState,
    invitationData: invitation.data,
    drawerOpen: ui.drawerOpen,
    darkMode: ui.darkMode,
  };
};

/** @deprecated Prefer `useUIStore()` and call individual setters directly. */
export const useTemantenSetter = (): Dispatch<SetStateAction<UIState>> => {
  const { ui } = useTemantenStore();
  return useCallback(
    (action: SetStateAction<UIState>) => {
      const current: UIState = {
        playAudio: ui.playAudio,
        screenState: ui.screenState,
        drawerOpen: ui.drawerOpen,
        darkMode: ui.darkMode,
      };
      const next = typeof action === 'function' ? action(current) : action;
      ui.setScreenState(next.screenState);
      ui.setPlayAudio(next.playAudio);
      ui.setDrawerOpen(next.drawerOpen);
      ui.setDarkMode(next.darkMode);
    },
    [ui]
  );
};
