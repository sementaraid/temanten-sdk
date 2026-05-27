import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, Dispatch, SetStateAction } from 'react';

type LoveStoryEntry = {
    date: string;
    title: string;
    content: string;
};
type InvitationData = {
    id: string;
    title: string;
    message: string;
    bride: {
        nickname: string;
        fullName: string;
        birthOrder: string;
        father: string;
        mother: string;
        instagram?: string;
    };
    groom: {
        nickname: string;
        fullName: string;
        birthOrder: string;
        father: string;
        mother: string;
        instagram?: string;
    };
    ceremony: {
        date: string;
        time: string;
        locationName: string;
        address: string;
        mapsUrl: string;
    };
    reception: {
        date: string;
        time: string;
        locationName: string;
        address: string;
        mapsUrl: string;
    };
    loveStory: LoveStoryEntry[];
    gift: {
        bankName: string;
        accountNumber: string;
        accountName: string;
        ewalletProvider: string;
        ewalletNumber: string;
        ewalletName: string;
    };
};
type UIState = {
    playAudio: boolean;
    screenState: 'welcome' | 'main';
    drawerOpen: boolean;
    darkMode: boolean;
};
interface UIStore extends UIState {
    setScreenState(state: 'welcome' | 'main'): void;
    setPlayAudio(value: boolean): void;
    setDrawerOpen(value: boolean): void;
    setDarkMode(value: boolean): void;
}
interface InvitationStoreBase {
    readonly source: 'remote' | 'mock' | 'builder';
    readonly data: InvitationData;
    readonly isLoading: boolean;
    readonly error: string | null;
}
interface MockInvitationStore extends InvitationStoreBase {
    readonly source: 'mock';
    update(updater: (prev: InvitationData) => InvitationData): void;
}
type GuestComment = {
    id: string;
    name: string;
    message: string;
    timestamp: Date;
};
type Attendance = 'attending' | 'tentative' | 'not_attending';
interface GuestStore {
    readonly guestId: string | null;
    readonly comments: GuestComment[];
    readonly commentsLoading: boolean;
    readonly submitting: boolean;
    readonly submitted: boolean;
    submit(name: string, message: string, attendance: Attendance | null): Promise<void>;
}
interface TemantenStore {
    readonly mode: 'live' | 'demo';
    readonly ui: UIStore;
    readonly invitation: InvitationStoreBase;
    readonly guest: GuestStore;
}
type TemantenContextType = UIState & {
    invitationData: InvitationData;
};
type TemplateCategory = 'ELEGANT' | 'MODERN' | 'RUSTIC' | 'MINIMALIST' | 'TRADITIONAL';
interface TemplateManifest {
    slug: string;
    name: string;
    description: string;
    category: TemplateCategory;
    imageUrl?: string;
    tags?: string[];
}
interface CdnTemplateEntry extends TemplateManifest {
    bundleUrl: string;
    cssUrl?: string;
    version: string;
}

declare const DEFAULT_INVITATION_DATA: InvitationData;

type TemantenProviderProps = ({
    mode: 'live';
    /** The guest's ID from the invitation URL (`?guest_id=`). */
    guestId?: string;
    /** Pre-fetched invitation data — avoids an extra network round-trip. */
    initialData?: InvitationData;
} | {
    mode: 'demo';
    /** Seed data for the demo. Falls back to the default "Budi & Putri" placeholder. */
    initialData?: InvitationData;
}) & {
    children: ReactNode;
};
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
declare const TemantenProvider: (props: TemantenProviderProps) => react_jsx_runtime.JSX.Element;
declare const useTemantenStore: () => TemantenStore;
declare const useUIStore: () => UIStore;
declare const useInvitationStore: () => InvitationStoreBase;
/** @deprecated Prefer `useUIStore()` and `useInvitationStore()`. */
declare const useTemantenState: () => TemantenContextType;
/** @deprecated Prefer `useUIStore()` and call individual setters directly. */
declare const useTemantenSetter: () => Dispatch<SetStateAction<UIState>>;

type WindowFrameProps = {
    children: ReactNode;
};
declare const WindowFrame: ({ children }: WindowFrameProps) => react_jsx_runtime.JSX.Element | null;

declare const Audio: () => react_jsx_runtime.JSX.Element;

declare const SnowfallEffect: () => react_jsx_runtime.JSX.Element | null;

export { type Attendance, Audio, type CdnTemplateEntry, DEFAULT_INVITATION_DATA, type GuestComment, type GuestStore, type InvitationData, type InvitationStoreBase, type LoveStoryEntry, type MockInvitationStore, SnowfallEffect, type TemantenContextType, TemantenProvider, type TemantenProviderProps, type TemantenStore, type TemplateCategory, type TemplateManifest, type UIState, type UIStore, WindowFrame, type WindowFrameProps, useInvitationStore, useTemantenSetter, useTemantenState, useTemantenStore, useUIStore };
