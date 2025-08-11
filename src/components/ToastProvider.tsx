"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type Kind = "success" | "error";
type Toast = { id: number; kind: Kind; text: string; duration: number };

type ToastCtx = {
  showSuccess: (text: string, opts?: { duration?: number }) => void;
  showError: (text: string, opts?: { duration?: number }) => void;
};

const Ctx = createContext<ToastCtx | undefined>(undefined);
const DEFAULT_MS = 10000; // ✅ Varsayılan 10 saniye

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const timers = useRef<Record<number, number>>({});

  const enqueue = useCallback(
    (kind: Kind, text: string, duration = DEFAULT_MS) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, kind, text, duration }]);
      const t = window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
        delete timers.current[id];
      }, duration);
      timers.current[id] = t;
    },
    []
  );

  const value: ToastCtx = {
    showSuccess: (text, opts) =>
      enqueue("success", text, opts?.duration ?? DEFAULT_MS),
    showError: (text, opts) =>
      enqueue("error", text, opts?.duration ?? DEFAULT_MS),
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "grid",
          gap: 8,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              padding: "12px 16px",
              minWidth: 240,
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              background: t.kind === "success" ? "#16a34a" : "#dc2626",
              boxShadow: "0 8px 24px rgba(0,0,0,.18)",
              animation: "fadeInOut 0.3s ease",
            }}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* Fade-in/out animasyonu */}
      <style jsx global>{`
        @keyframes fadeInOut {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
}
