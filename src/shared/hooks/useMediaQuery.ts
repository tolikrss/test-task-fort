import { useCallback, useSyncExternalStore } from 'react';

/** Subscribes to a media query via useSyncExternalStore — no extra render or flash on mount. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);

      mediaQueryList.addEventListener('change', onChange);

      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
