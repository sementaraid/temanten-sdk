// src/constant.ts
var DEFAULT_INVITATION_DATA = {
  id: "",
  title: "Undangan Pernikahan Putri & Budi",
  message: "Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.",
  bride: {
    nickname: "Putri",
    fullName: "NUR PUTRI RAHAYU",
    birthOrder: "Putri pertama dari",
    father: "Bapak Sudarsono",
    mother: "Ibu Sri Wahyuni"
  },
  groom: {
    nickname: "Budi",
    fullName: "BUDI SANTOSO",
    birthOrder: "Putra pertama dari",
    father: "Bapak Suparman",
    mother: "Ibu Siti Aminah"
  },
  ceremony: {
    date: "2026-07-26",
    time: "08:00",
    locationName: "Kediaman Mempelai Wanita",
    address: "Jl. Contoh No. 1 RT. 01 RW. 01 Kel. Contoh Kec. Contoh Kota",
    mapsUrl: "https://maps.app.goo.gl/contoh"
  },
  reception: {
    date: "2026-07-26",
    time: "13:00",
    locationName: "Kediaman Mempelai Wanita",
    address: "Jl. Contoh No. 1 RT. 01 RW. 01 Kel. Contoh Kec. Contoh Kota",
    mapsUrl: "https://maps.app.goo.gl/contoh"
  },
  loveStory: [
    {
      date: "1 Januari 2025",
      title: "Pertemuan Pertama",
      content: "Pertemuan pertama yang tidak pernah disangka akan terjadi melalui rekan sejawat tanpa disangka menjadi cerita kami."
    },
    {
      date: "1 Juni 2026",
      title: "Komitmen Awal",
      content: "Setelah menjalani hubungan selama setahun dan menemukan kecocokan, akhirnya kami memutuskan untuk menjalin hubungan ke jenjang yang lebih serius."
    },
    {
      date: "26 Juli 2026",
      title: "Pernikahan",
      content: "Kami melangsungkan pernikahan sebagai langkah untuk membawa hubungan ini ke jenjang yang lebih serius untuk hidup dan menua bersama."
    }
  ],
  gift: {
    bankName: "BCA",
    accountNumber: "0000000000",
    accountName: "NUR PUTRI RAHAYU",
    ewalletProvider: "",
    ewalletNumber: "",
    ewalletName: ""
  }
};

// src/context/index.tsx
import {
  createContext,
  useContext,
  useCallback as useCallback3
} from "react";

// src/context/stores/ui.store.ts
import { useState } from "react";
var useUIStoreImpl = () => {
  const [playAudio, setPlayAudio] = useState(false);
  const [screenState, setScreenState] = useState("welcome");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  return {
    playAudio,
    screenState,
    drawerOpen,
    darkMode,
    setPlayAudio,
    setScreenState,
    setDrawerOpen,
    setDarkMode
  };
};

// src/context/stores/invitation.store.ts
import { useState as useState2, useCallback } from "react";
var useLiveInvitationStoreImpl = (initialData) => ({
  source: "remote",
  data: initialData ?? DEFAULT_INVITATION_DATA,
  isLoading: false,
  error: null
});
var useMockInvitationStoreImpl = (initialData) => {
  const [override, setOverride] = useState2(null);
  const data = override ?? initialData ?? DEFAULT_INVITATION_DATA;
  const update = useCallback(
    (updater) => {
      setOverride((prev) => updater(prev ?? initialData ?? DEFAULT_INVITATION_DATA));
    },
    [initialData]
  );
  return { source: "mock", data, isLoading: false, error: null, update };
};

// src/context/stores/guest.store.ts
import { useState as useState3, useEffect, useRef, useCallback as useCallback2 } from "react";
var POLL_INTERVAL_MS = 1e4;
var useGuestStoreImpl = (invitationId, guestId) => {
  const [comments, setComments] = useState3([]);
  const [commentsLoading, setCommentsLoading] = useState3(!!invitationId);
  const [submitting, setSubmitting] = useState3(false);
  const [submitted, setSubmitted] = useState3(false);
  const intervalRef = useRef(null);
  const pollComments = useCallback2(async (id) => {
    try {
      const res = await fetch(`/api/guest-responses/${id}`);
      if (!res.ok) return;
      const raw = await res.json();
      setComments(
        raw.map((r) => ({
          id: r.id,
          name: r.name,
          message: r.message,
          timestamp: new Date(r.createdAt)
        }))
      );
      setCommentsLoading(false);
    } catch {
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
  const submit = useCallback2(
    async (name, message, attendance) => {
      setSubmitting(true);
      try {
        if (guestId) {
          await fetch(`/api/guest-list/${guestId}/confirm`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: attendance,
              message: message.trim(),
              name: name.trim()
            })
          });
          setSubmitted(true);
          if (invitationId) void pollComments(invitationId);
        } else {
          setComments((prev) => [
            {
              id: Date.now().toString(),
              name: name.trim(),
              message: message.trim(),
              timestamp: /* @__PURE__ */ new Date()
            },
            ...prev
          ]);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [guestId, invitationId, pollComments]
  );
  return { guestId, comments, commentsLoading, submitting, submitted, submit };
};

// src/context/index.tsx
import { jsx } from "react/jsx-runtime";
var TemantenContext = createContext(void 0);
var TemantenProvider = (props) => {
  const ui = useUIStoreImpl();
  const liveInvitation = useLiveInvitationStoreImpl(
    props.mode === "live" ? props.initialData : void 0
  );
  const mockInvitation = useMockInvitationStoreImpl(
    props.mode === "demo" ? props.initialData : void 0
  );
  const guest = useGuestStoreImpl(
    props.mode === "live" ? props.initialData?.id ?? null : null,
    props.mode === "live" ? props.guestId ?? null : null
  );
  const invitation = props.mode === "live" ? liveInvitation : mockInvitation;
  return /* @__PURE__ */ jsx(TemantenContext.Provider, { value: { mode: props.mode, ui, invitation, guest }, children: props.children });
};
var useTemantenStore = () => {
  const ctx = useContext(TemantenContext);
  if (ctx === void 0) throw new Error("useTemantenStore must be used within TemantenProvider");
  return ctx;
};
var useUIStore = () => useTemantenStore().ui;
var useInvitationStore = () => useTemantenStore().invitation;
var useTemantenState = () => {
  const { ui, invitation } = useTemantenStore();
  return {
    playAudio: ui.playAudio,
    screenState: ui.screenState,
    invitationData: invitation.data,
    drawerOpen: ui.drawerOpen,
    darkMode: ui.darkMode
  };
};
var useTemantenSetter = () => {
  const { ui } = useTemantenStore();
  return useCallback3(
    (action) => {
      const current = {
        playAudio: ui.playAudio,
        screenState: ui.screenState,
        drawerOpen: ui.drawerOpen,
        darkMode: ui.darkMode
      };
      const next = typeof action === "function" ? action(current) : action;
      ui.setScreenState(next.screenState);
      ui.setPlayAudio(next.playAudio);
      ui.setDrawerOpen(next.drawerOpen);
      ui.setDarkMode(next.darkMode);
    },
    [ui]
  );
};

// src/components/window-frame.tsx
import { useSyncExternalStore } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var subscribe = () => () => {
};
var useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);
var WindowFrame = ({ children }) => {
  const isClient = useIsClient();
  const { screenState, darkMode } = useUIStore();
  if (!isClient) return null;
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: darkMode ? "dark" : "",
      style: { width: "100%", margin: "auto", position: "relative", maxWidth: "640px" },
      children: /* @__PURE__ */ jsx2(
        "div",
        {
          className: "temanten-template",
          style: screenState === "welcome" ? { overflow: "hidden", height: "100vh" } : void 0,
          children
        }
      )
    }
  );
};

// src/components/audio.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Audio = () => {
  const { playAudio } = useUIStore();
  const audioRef = useRef2(null);
  useEffect2(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playAudio) {
      audio.play().catch(() => {
      });
    } else {
      audio.pause();
    }
  }, [playAudio]);
  return /* @__PURE__ */ jsx3("audio", { ref: audioRef, src: "/music/pawestri_cut.mp3", loop: true, preload: "auto", className: "hidden" });
};

// src/components/snowfall.tsx
import Snowfall from "react-snowfall";
import { jsx as jsx4 } from "react/jsx-runtime";
var SnowfallEffect = () => {
  const { screenState } = useUIStore();
  if (screenState === "welcome") return null;
  return /* @__PURE__ */ jsx4(
    Snowfall,
    {
      color: "#e1c6acff",
      snowflakeCount: 500,
      wind: [-1, 1],
      radius: [1, 4],
      speed: [1, 3],
      style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.8
      }
    }
  );
};
export {
  Audio,
  DEFAULT_INVITATION_DATA,
  SnowfallEffect,
  TemantenProvider,
  WindowFrame,
  useInvitationStore,
  useTemantenSetter,
  useTemantenState,
  useTemantenStore,
  useUIStore
};
//# sourceMappingURL=index.js.map