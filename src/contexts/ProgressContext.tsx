import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

interface ProgressState {
  uploadConfirmed: boolean;
  discoveryConfirmed: boolean;
  chatConfirmed: boolean;
  completedAt: number | null;
}

interface ProgressContextType extends ProgressState {
  confirmUpload: () => void;
  confirmDiscovery: () => void;
  confirmChat: () => void;
  resetProgress: () => void;
  isComplete: boolean;
  isVisible: boolean;
}

const STORAGE_KEY = 'onmark_progress_v1';

const defaultState: ProgressState = {
  uploadConfirmed: false,
  discoveryConfirmed: false,
  chatConfirmed: false,
  completedAt: null,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { files } = useUser();

  const [state, setState] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      const hasFiles = Array.isArray(files) && files.length > 0;
      // don't allow confirmations to be true if there are no uploaded files
      return {
        ...defaultState,
        ...parsed,
        uploadConfirmed: !!(parsed.uploadConfirmed && hasFiles),
        discoveryConfirmed: !!(parsed.discoveryConfirmed && hasFiles),
        chatConfirmed: !!(parsed.chatConfirmed && hasFiles),
        completedAt: hasFiles ? parsed.completedAt ?? null : null,
      } as ProgressState;
    } catch {
      return defaultState;
    }
  });

  const [isVisible, setIsVisible] = React.useState<boolean>(() => {
    // initial visible if not all done
    const s = state;
    const allDone = s.uploadConfirmed && s.discoveryConfirmed && s.chatConfirmed;
    if (!allDone) return true;
    // if completedAt exists and was recent, keep visible, else hide
    if (!s.completedAt) return true;
    return Date.now() - s.completedAt < 10000;
  });

  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // If files are removed and none remain, reset progress to defaults
  useEffect(() => {
    const hasFiles = Array.isArray(files) && files.length > 0;
    if (!hasFiles) {
      if (state.uploadConfirmed || state.discoveryConfirmed || state.chatConfirmed || state.completedAt) {
        // clear stored progress when there are no files
        setState(defaultState);
        setIsVisible(true);
      }
    }
    // if files appear, do nothing — explicit confirmations should drive progress
  }, [files, state.uploadConfirmed, state.discoveryConfirmed, state.chatConfirmed, state.completedAt]);

  // manage visibility timer when completed
  React.useEffect(() => {
    // clear any existing timer
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    const allDone = state.uploadConfirmed && state.discoveryConfirmed && state.chatConfirmed;
    if (!allDone) {
      setIsVisible(true);
      return;
    }

    // all done — compute remaining time based on completedAt
    const now = Date.now();
    const completedAt = state.completedAt || now;
    const elapsed = now - completedAt;
    const remaining = Math.max(0, 10000 - elapsed);

    if (remaining <= 0) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    hideTimer.current = setTimeout(() => {
      setIsVisible(false);
      hideTimer.current = null;
    }, remaining);

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [state.uploadConfirmed, state.discoveryConfirmed, state.chatConfirmed, state.completedAt]);

  const confirmUpload = () => {
    setState(s => ({ ...s, uploadConfirmed: true }));
  };

  const confirmDiscovery = () => {
    // only confirm discovery if upload was already confirmed
    setState(s => {
      if (!s.uploadConfirmed) return s; // no-op if prerequisite not met
      const next = { ...s, discoveryConfirmed: true } as ProgressState;
      // if all three already true, ensure completedAt set
      if (next.uploadConfirmed && next.discoveryConfirmed && next.chatConfirmed && !next.completedAt) {
        next.completedAt = Date.now();
      }
      return next;
    });
  };

  const confirmChat = () => {
    // only confirm chat if discovery was already confirmed
    setState(s => {
      if (!s.discoveryConfirmed) return s; // no-op
      const next = { ...s, chatConfirmed: true } as ProgressState;
      if (next.uploadConfirmed && next.discoveryConfirmed && next.chatConfirmed) {
        next.completedAt = Date.now();
      }
      return next;
    });
  };

  const resetProgress = () => {
    // clear timers and reset
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setIsVisible(true);
    setState(defaultState);
  };

  const isComplete = state.uploadConfirmed && state.discoveryConfirmed && state.chatConfirmed;
  // visible indicates whether the stepper should be shown (allows a short delay after completion)
  const value: ProgressContextType = {
    ...state,
    confirmUpload,
    confirmDiscovery,
    confirmChat,
    resetProgress,
    isComplete,
    isVisible,
  };
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export default ProgressContext;
