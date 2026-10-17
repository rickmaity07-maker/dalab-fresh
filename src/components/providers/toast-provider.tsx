"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { createContext, use, useCallback, useEffect, useRef, useState } from "react";

type Toast = { id: number; message: string; icon?: React.ReactNode };
const ToastContext = createContext<((message: string, icon?: React.ReactNode) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((message: string, icon?: React.ReactNode) => {
    setToast({ id: Date.now(), message, icon });
  }, []);

  useEffect(() => {
    if (!toast) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer.current);
  }, [toast]);

  return (
    <ToastContext value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(148px+env(safe-area-inset-bottom,0px))] z-50 flex justify-center px-4 lg:bottom-6">
        {toast ? (
          <div key={toast.id} className="flex max-w-full animate-toast-in items-center gap-2.5 rounded-full bg-ink px-[18px] py-3 text-sm font-bold text-bg shadow-soft">
            {toast.icon ?? <CheckIcon size={20} />}
            <span>{toast.message}</span>
          </div>
        ) : null}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
