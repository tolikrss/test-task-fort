import { usePointsUiStore } from '@/features/points';
import { Button } from '@/shared/ui/controls';

/** Add-mode button and hint over the map (outside MapContainer, so clicks never reach the map). */
export function AddPointControl() {
  const mode = usePointsUiStore((state) => state.mode);
  const hasDraft = usePointsUiStore((state) => state.draft !== null);
  const startAdding = usePointsUiStore((state) => state.startAdding);
  const stopAdding = usePointsUiStore((state) => state.stopAdding);

  if (mode === 'idle') {
    return (
      <div className="absolute top-3 right-3 z-[1000]">
        <Button onClick={startAdding} className="shadow-md">
          + Додати точку
        </Button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="absolute top-3 right-3 left-14 z-[1000] ml-auto flex max-w-md items-center gap-3 rounded-md bg-slate-900/90 px-4 py-2 text-sm text-white shadow-lg"
    >
      <p className="flex-1">
        {hasDraft
          ? 'Заповніть форму або клікніть, щоб перемістити точку'
          : 'Клікніть у межах будь-якого поля'}
        <span className="text-slate-300"> · Esc — скасувати</span>
      </p>
      <Button size="sm" variant="secondary" onClick={stopAdding}>
        Скасувати
      </Button>
    </div>
  );
}
