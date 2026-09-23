import { useCallback, useRef } from 'react';

/** id → element (or Leaflet instance) map filled by callback refs, e.g. list rows or map markers. */
export function useRefMap<T>() {
  const mapRef = useRef(new Map<string, T>());
  const get = useCallback((id: string) => mapRef.current.get(id), []);
  const register = useCallback(
    (id: string) => (node: T | null) => {
      if (node) mapRef.current.set(id, node);
      else mapRef.current.delete(id);
    },
    [],
  );

  return { get, register };
}
