import { FieldInfo, FieldList } from '@/features/fields';
import { PointForm, PointsPanel } from '@/features/points';
import { IconButton } from '@/shared/ui/controls';

import type { Ref } from 'react';

interface SidebarProps {
  /** Close the drawer (✕ button). */
  onClose: () => void;
  /** The user picked a field or a point — on tablet hide the drawer to reveal the map. */
  onNavigate: () => void;
  closeButtonRef: Ref<HTMLButtonElement>;
}

export function Sidebar({ onClose, onNavigate, closeButtonRef }: SidebarProps) {
  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <span className="font-semibold">Панель керування</span>
        <IconButton ref={closeButtonRef} label="Закрити панель" icon="✕" onClick={onClose} />
      </div>
      <section aria-labelledby="fields-heading">
        <h2 id="fields-heading" className="mb-2 text-sm font-semibold text-slate-700">
          Поля
        </h2>
        <FieldList onSelect={onNavigate} />
      </section>
      <FieldInfo />
      <PointForm />
      <hr className="border-slate-200" />
      <PointsPanel onPointActivate={onNavigate} />
    </div>
  );
}
