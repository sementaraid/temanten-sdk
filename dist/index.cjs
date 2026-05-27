"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Audio: () => Audio,
  DEFAULT_INVITATION_DATA: () => DEFAULT_INVITATION_DATA,
  SnowfallEffect: () => SnowfallEffect,
  TemantenProvider: () => TemantenProvider,
  WindowFrame: () => WindowFrame,
  useInvitationStore: () => useInvitationStore,
  useTemantenSetter: () => useTemantenSetter,
  useTemantenState: () => useTemantenState,
  useTemantenStore: () => useTemantenStore,
  useUIStore: () => useUIStore
});
module.exports = __toCommonJS(index_exports);

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
var import_react4 = require("react");

// src/context/stores/ui.store.ts
var import_react = require("react");
var useUIStoreImpl = () => {
  const [playAudio, setPlayAudio] = (0, import_react.useState)(false);
  const [screenState, setScreenState] = (0, import_react.useState)("welcome");
  const [drawerOpen, setDrawerOpen] = (0, import_react.useState)(false);
  const [darkMode, setDarkMode] = (0, import_react.useState)(false);
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
var import_react2 = require("react");
var useLiveInvitationStoreImpl = (initialData) => ({
  source: "remote",
  data: initialData ?? DEFAULT_INVITATION_DATA,
  isLoading: false,
  error: null
});
var useMockInvitationStoreImpl = (initialData) => {
  const [override, setOverride] = (0, import_react2.useState)(null);
  const data = override ?? initialData ?? DEFAULT_INVITATION_DATA;
  const update = (0, import_react2.useCallback)(
    (updater) => {
      setOverride((prev) => updater(prev ?? initialData ?? DEFAULT_INVITATION_DATA));
    },
    [initialData]
  );
  return { source: "mock", data, isLoading: false, error: null, update };
};

// src/context/stores/guest.store.ts
var import_react3 = require("react");
var POLL_INTERVAL_MS = 1e4;
var useGuestStoreImpl = (invitationId, guestId) => {
  const [comments, setComments] = (0, import_react3.useState)([]);
  const [commentsLoading, setCommentsLoading] = (0, import_react3.useState)(!!invitationId);
  const [submitting, setSubmitting] = (0, import_react3.useState)(false);
  const [submitted, setSubmitted] = (0, import_react3.useState)(false);
  const intervalRef = (0, import_react3.useRef)(null);
  const pollComments = (0, import_react3.useCallback)(async (id) => {
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
  (0, import_react3.useEffect)(() => {
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
  const submit = (0, import_react3.useCallback)(
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
var import_jsx_runtime = require("react/jsx-runtime");
var TemantenContext = (0, import_react4.createContext)(void 0);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemantenContext.Provider, { value: { mode: props.mode, ui, invitation, guest }, children: props.children });
};
var useTemantenStore = () => {
  const ctx = (0, import_react4.useContext)(TemantenContext);
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
  return (0, import_react4.useCallback)(
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
var import_react5 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var subscribe = () => () => {
};
var useIsClient = () => (0, import_react5.useSyncExternalStore)(subscribe, () => true, () => false);
var WindowFrame = ({ children }) => {
  const isClient = useIsClient();
  const { screenState, darkMode } = useUIStore();
  if (!isClient) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: darkMode ? "dark" : "",
      style: { width: "100%", margin: "auto", position: "relative", maxWidth: "640px" },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_react6 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var Audio = () => {
  const { playAudio } = useUIStore();
  const audioRef = (0, import_react6.useRef)(null);
  (0, import_react6.useEffect)(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playAudio) {
      audio.play().catch(() => {
      });
    } else {
      audio.pause();
    }
  }, [playAudio]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("audio", { ref: audioRef, src: "/music/pawestri_cut.mp3", loop: true, preload: "auto", className: "hidden" });
};

// src/components/snowfall.tsx
var import_react_snowfall = __toESM(require("react-snowfall"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
var SnowfallEffect = () => {
  const { screenState } = useUIStore();
  if (screenState === "welcome") return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react_snowfall.default,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map