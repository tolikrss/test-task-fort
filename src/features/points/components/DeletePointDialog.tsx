import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { showToast } from '@/shared/ui/toast';

import { usePointsStore } from '../store/pointsStore';
import { usePointsUiStore } from '../store/pointsUiStore';

/** One dialog for the whole app: both the marker popup and a list row request deletion. */
export function DeletePointDialog() {
  const pendingDeleteId = usePointsUiStore((state) => state.pendingDeleteId);
  const cancelDelete = usePointsUiStore((state) => state.cancelDelete);
  const removePoint = usePointsStore((state) => state.removePoint);

  const confirm = () => {
    if (pendingDeleteId !== null) {
      removePoint(pendingDeleteId);
      showToast({ tone: 'success', message: 'Точку видалено' });
    }

    cancelDelete();
  };

  return (
    <ConfirmDialog
      open={pendingDeleteId !== null}
      title="Видалити точку?"
      description="Цю дію не можна скасувати."
      confirmLabel="Видалити"
      onConfirm={confirm}
      onCancel={cancelDelete}
    />
  );
}
