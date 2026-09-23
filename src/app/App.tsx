import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { MapView } from '@/features/map';
import { DeletePointDialog, usePointsUiStore } from '@/features/points';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/controls';
import { Toaster } from '@/shared/ui/toast';

import { Sidebar } from './Sidebar';
import { useGlobalEscape } from './useGlobalEscape';

/** Must match Tailwind's `lg` breakpoint (64rem = 1024px). */
const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';

/**
 * Desktop: panel on the left + map. Tablet: the panel is a drawer over the map.
 * The drawer is an overlay (position: fixed), so the map size never changes and invalidateSize is not needed.
 */
export function App() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const hasDraft = usePointsUiStore((state) => state.draft !== null);
  const sidebarId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // A point draft opens the panel so the form is visible; after save or cancel the panel
  // closes by itself — a derived value, no state syncing through an effect.
  const isSidebarVisible = isDesktop || isDrawerOpen || hasDraft;
  const isDrawerModal = !isDesktop && isSidebarVisible;

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const dismissDrawer = useCallback(() => {
    setDrawerOpen(false);
    usePointsUiStore.getState().stopAdding();
  }, []);

  useGlobalEscape(closeDrawer);

  // Focus: on open move to the close button, on close return to the menu button.
  const wasDrawerOpen = useRef(false);

  useEffect(() => {
    if (isDesktop) return;
    if (isDrawerOpen) closeButtonRef.current?.focus();
    else if (wasDrawerOpen.current) menuButtonRef.current?.focus();
    wasDrawerOpen.current = isDrawerOpen;
  }, [isDrawerOpen, isDesktop]);

  return (
    <div className="flex h-full flex-col">
      <header
        inert={isDrawerModal}
        className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4"
      >
        <IconButton
          ref={menuButtonRef}
          label="Відкрити панель"
          icon="☰"
          className="lg:hidden"
          aria-controls={sidebarId}
          aria-expanded={isSidebarVisible}
          onClick={() => setDrawerOpen(true)}
        />
        <h1 className="text-lg font-semibold text-brand-700">Моніторинг полів</h1>
      </header>

      <div className="flex min-h-0 flex-1">
        {isDrawerModal && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[1100] bg-slate-900/40 lg:hidden"
            onClick={dismissDrawer}
          />
        )}

        <aside
          id={sidebarId}
          aria-label="Панель керування"
          // A hidden drawer must not receive keyboard focus.
          inert={!isSidebarVisible}
          className={cn(
            'fixed inset-y-0 left-0 z-[1200] w-80 max-w-[85vw] overflow-y-auto border-r border-slate-200 bg-white shadow-xl transition-transform duration-200',
            'lg:static lg:z-auto lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none',
            isSidebarVisible ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar
            onClose={dismissDrawer}
            onNavigate={closeDrawer}
            closeButtonRef={closeButtonRef}
          />
        </aside>

        <main inert={isDrawerModal} className="relative min-w-0 flex-1">
          <MapView />
        </main>
      </div>

      <Toaster />
      <DeletePointDialog />
    </div>
  );
}
