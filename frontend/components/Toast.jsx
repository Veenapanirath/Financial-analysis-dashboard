'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

const TOAST_CONFIG = {
  success: {
    icon: '✅',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    shadow: 'rgba(16, 185, 129, 0.15)',
  },
  error: {
    icon: '❌',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.25)',
    color: '#fb7185',
    shadow: 'rgba(244, 63, 94, 0.15)',
  },
  info: {
    icon: 'ℹ️',
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.25)',
    color: '#818cf8',
    shadow: 'rgba(99, 102, 241, 0.15)',
  },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);

      return id;
    },
    [removeToast]
  );

  const toastMethods = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}

      {/* Toast container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: 400 }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 22,
                }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: config.bg,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${config.border}`,
                  boxShadow: `0 8px 32px ${config.shadow}`,
                }}
              >
                {/* Icon */}
                <span className="text-lg flex-shrink-0 mt-0.5">{config.icon}</span>

                {/* Message */}
                <p
                  className="text-sm font-medium flex-1"
                  style={{ color: config.color }}
                >
                  {t.message}
                </p>

                {/* Close button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors duration-200 hover:bg-white/5"
                  style={{ color: 'rgba(148, 163, 184, 0.5)' }}
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
