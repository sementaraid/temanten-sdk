// ─── Invitation data ──────────────────────────────────────────────────────────
// Mirrors src/client/context/types.ts — kept in sync manually.
// Templates import from here; the main app imports from its own context/types.ts.

export type LoveStoryEntry = {
  date: string;
  title: string;
  content: string;
};

export type InvitationData = {
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
  gallery: string[];
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

// ─── UI state ─────────────────────────────────────────────────────────────────

export type UIState = {
  playAudio: boolean;
  screenState: 'welcome' | 'main';
  drawerOpen: boolean;
  darkMode: boolean;
};

export interface UIStore extends UIState {
  setScreenState(state: 'welcome' | 'main'): void;
  setPlayAudio(value: boolean): void;
  setDrawerOpen(value: boolean): void;
  setDarkMode(value: boolean): void;
}

// ─── Invitation stores ────────────────────────────────────────────────────────

export interface InvitationStoreBase {
  readonly source: 'remote' | 'mock' | 'builder';
  readonly data: InvitationData;
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface MockInvitationStore extends InvitationStoreBase {
  readonly source: 'mock';
  update(updater: (prev: InvitationData) => InvitationData): void;
}

// ─── Guest store ──────────────────────────────────────────────────────────────

export type GuestComment = {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
};

export type Attendance = 'attending' | 'tentative' | 'not_attending';

export interface GuestStore {
  readonly guestId: string | null;
  readonly comments: GuestComment[];
  readonly commentsLoading: boolean;
  readonly submitting: boolean;
  readonly submitted: boolean;
  submit(name: string, message: string, attendance: Attendance | null): Promise<void>;
}

// ─── Full context ─────────────────────────────────────────────────────────────

export interface TemantenStore {
  readonly mode: 'live' | 'demo';
  readonly ui: UIStore;
  readonly invitation: InvitationStoreBase;
  readonly guest: GuestStore;
}

export type TemantenContextType = UIState & {
  invitationData: InvitationData;
};

// ─── Manifest ─────────────────────────────────────────────────────────────────

export type TemplateCategory = 'ELEGANT' | 'MODERN' | 'RUSTIC' | 'MINIMALIST' | 'TRADITIONAL';

export interface TemplateManifest {
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  imageUrl?: string;
  tags?: string[];
}

// ─── CDN registry entry ───────────────────────────────────────────────────────

export interface CdnTemplateEntry extends TemplateManifest {
  bundleUrl: string;
  cssUrl?: string;
  version: string;
}
