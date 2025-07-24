import { useCallback, useMemo } from 'react';

export const useIOSTouch = (hapticDuration = 50) => {
  // Detect iOS device
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  // Handle haptic feedback
  const triggerHaptic = useCallback(() => {
    // Try iOS native haptics first
    if ((window as any)?.webkit?.messageHandlers?.hapticFeedback) {
      (window as any).webkit.messageHandlers.hapticFeedback.postMessage('selection');
    } 
    // Fallback to vibration API
    else if (window?.navigator?.vibrate) {
      window.navigator.vibrate(hapticDuration);
    }
  }, [hapticDuration]);

  // Prevent double-tap zoom
  const preventDoubleTapZoom = useCallback((e: TouchEvent) => {
    e.preventDefault();
    return false;
  }, []);

  return {
    isIOS,
    triggerHaptic,
    preventDoubleTapZoom
  };
};
