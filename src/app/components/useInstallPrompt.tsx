import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   useInstallPrompt — captures the browser's `beforeinstallprompt` event and
   exposes a `promptInstall()` callback + `canInstall` / `isInstalled` state.

   Support matrix:
     - Chrome / Edge desktop     → event fires, prompt works
     - Android Chrome / Samsung  → event fires, prompt works
     - Firefox desktop           → no event, canInstall stays false
     - iOS Safari                → no event (must use Share → Add to Home Screen)
     - In-app webviews           → usually no event
═══════════════════════════════════════════════════════════════════════════ */

// Standard Chrome-flavour event shape.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type InstallState = {
  canInstall: boolean;   // true when a deferred prompt is available
  isInstalled: boolean;  // true when running in standalone (already installed)
  isIos: boolean;        // iOS Safari — needs manual Add-to-Home-Screen flow
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
};

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mm = window.matchMedia?.('(display-mode: standalone)').matches;
  // iOS Safari reports via navigator.standalone
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return !!mm || iosStandalone;
}

function detectIos(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

export function useInstallPrompt(): InstallState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(detectStandalone());
  const ios = detectIos();

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setInstalled(true);
    };
    const onDisplayChange = () => setInstalled(detectStandalone());

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    const mql = window.matchMedia?.('(display-mode: standalone)');
    mql?.addEventListener?.('change', onDisplayChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      mql?.removeEventListener?.('change', onDisplayChange);
    };
  }, []);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferred) return 'unavailable';
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome;
  };

  return {
    canInstall: !!deferred && !installed,
    isInstalled: installed,
    isIos: ios,
    promptInstall,
  };
}
