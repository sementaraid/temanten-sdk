import { useState, useEffect, useRef, useCallback } from 'react';
import type { GuestStore, GuestComment, Attendance } from '../../types';

type RawComment = { id: string; name: string; message: string; createdAt: string };
type GuestResponsesPayload = { message: string; results: RawComment[] };

const POLL_INTERVAL_MS = 10_000;

/**
 * Manages guest RSVP and comment polling.
 *
 * When `invitationId` is null (demo mode) the store is a complete no-op.
 * Polling uses `setInterval` + `fetch` so the store works outside of a
 * Vite/webpack context (no Web Worker import required).
 */
export const useGuestStoreImpl = (
  invitationId: string | null,
  guestId: string | null,
  isVip = false,
  showGiftSection = true
): GuestStore => {
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(!!invitationId);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollComments = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/guest-responses/${id}`);
      if (!res.ok) return;
      const payload: GuestResponsesPayload = await res.json();
      setComments(
        payload.results.map((r) => ({
          id: r.id,
          name: r.name,
          message: r.message,
          timestamp: new Date(r.createdAt),
        }))
      );
      setCommentsLoading(false);
    } catch {
      // Silently ignore network errors during polling
    }
  }, []);

  useEffect(() => {
    if (!invitationId) {
      setCommentsLoading(false);
      return;
    }

    void pollComments(invitationId);

    intervalRef.current = setInterval(() => {
      void pollComments(invitationId);
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [invitationId, pollComments]);

  const submit = useCallback(
    async (name: string, message: string, attendance: Attendance | null) => {
      setSubmitting(true);
      try {
        if (guestId) {
          await fetch(`/api/guest-list/${guestId}/confirm`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: attendance,
              message: message.trim(),
              name: name.trim(),
            }),
          });
          setSubmitted(true);
          if (invitationId) void pollComments(invitationId);
        } else {
          setComments((prev) => [
            {
              id: Date.now().toString(),
              name: name.trim(),
              message: message.trim(),
              timestamp: new Date(),
            },
            ...prev,
          ]);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [guestId, invitationId, pollComments]
  );

  return {
    guestId,
    isVip,
    showGiftSection,
    comments,
    commentsLoading,
    submitting,
    submitted,
    submit,
  };
};
