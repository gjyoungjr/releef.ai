"use client";

import * as React from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    console.log("Toast:", props.title, props.description);
    setToasts((prev) => [...prev, props]);
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
          {toasts.map((t, i) => (
            <div
              key={i}
              className={`bg-background border p-4 rounded-lg shadow-lg ${
                t.variant === "destructive" ? "border-red-500" : "border-gray-200"
              }`}
            >
              {t.title && <h4 className="font-semibold">{t.title}</h4>}
              {t.description && <p className="text-sm">{t.description}</p>}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}; 