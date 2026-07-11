import { useTemantenStore } from "../context/index";

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Whether background music is allowed to play right now.
 *
 * In `live` mode, music is disabled starting 1 hour before the ceremony
 * (akad) begins, and stays disabled for every subsequent load of that
 * invitation (the ceremony date is a fixed point in time). `demo` mode
 * (builder preview) always allows music — there's no real ceremony to
 * protect, and gating it would eventually silence the preview forever
 * once the placeholder ceremony date passes.
 */
export const useMusicAllowed = (): boolean => {
  const { mode, invitation } = useTemantenStore();

  if (mode !== "live") return true;

  const { date, time } = invitation.data.ceremony;
  const ceremonyAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(ceremonyAt.getTime())) return true;

  return Date.now() < ceremonyAt.getTime() - ONE_HOUR_MS;
};
