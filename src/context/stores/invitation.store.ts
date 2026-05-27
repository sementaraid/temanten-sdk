import { useState, useCallback } from 'react';
import type { InvitationData, InvitationStoreBase, MockInvitationStore } from '../../types';
import { DEFAULT_INVITATION_DATA } from '../../constant';

/**
 * Read-only store for live mode. The app pre-fetches invitation data and
 * passes it as `initialData` — no network call is made inside the provider.
 */
export const useLiveInvitationStoreImpl = (initialData?: InvitationData): InvitationStoreBase => ({
  source: 'remote',
  data: initialData ?? DEFAULT_INVITATION_DATA,
  isLoading: false,
  error: null,
});

/**
 * Local-state store with no network calls.
 * Used for template demos and previews. Changes via `update()` are in-memory only.
 */
export const useMockInvitationStoreImpl = (initialData?: InvitationData): MockInvitationStore => {
  const [override, setOverride] = useState<InvitationData | null>(null);

  const data = override ?? initialData ?? DEFAULT_INVITATION_DATA;

  const update = useCallback(
    (updater: (prev: InvitationData) => InvitationData) => {
      setOverride((prev) => updater(prev ?? initialData ?? DEFAULT_INVITATION_DATA));
    },
    [initialData]
  );

  return { source: 'mock', data, isLoading: false, error: null, update };
};
