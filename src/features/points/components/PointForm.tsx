import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useActiveField } from '@/features/fields';
import { Button, controlClassName, FormField } from '@/shared/ui/controls';
import { showToast } from '@/shared/ui/toast';

import {
  DESCRIPTION_MAX_LENGTH,
  POINT_TYPE_META,
  POINT_TYPES,
  pointFormSchema,
  type PointFormInput,
  type PointFormValues,
} from '../model';
import { usePointsStore } from '../store/pointsStore';
import { usePointsUiStore } from '../store/pointsUiStore';

import { PointCoordinates } from './PointCoordinates';

import type { LatLng } from '@/shared/lib/geo';

export function PointForm() {
  const draft = usePointsUiStore((state) => state.draft);

  if (!draft) return null;

  return <PointFormContent draft={draft} />;
}

function PointFormContent({ draft }: { draft: LatLng }) {
  const field = useActiveField();
  const addPoint = usePointsStore((state) => state.addPoint);
  const stopAdding = usePointsUiStore((state) => state.stopAdding);
  const titleId = useId();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PointFormInput, unknown, PointFormValues>({
    resolver: zodResolver(pointFormSchema),
    defaultValues: { type: '', description: '' },
  });
  // useWatch rather than watch(): a single-field subscription compatible with React Compiler memoization.
  const descriptionLength = useWatch({ control, name: 'description' }).length;

  const onSubmit = ({ type, description }: PointFormValues) => {
    addPoint({ fieldId: field.id, lat: draft.lat, lng: draft.lng, type, description });
    stopAdding();
    showToast({ tone: 'success', message: 'Точку додано' });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby={titleId}
      className="space-y-3 rounded-lg border border-brand-500 bg-white p-4 shadow-sm"
    >
      <h2 id={titleId} className="text-base font-semibold">
        Нова точка · {field.name}
      </h2>

      <PointCoordinates latLng={draft} />

      <FormField label="Тип точки" error={errors.type?.message}>
        {(fieldProps) => (
          <select {...fieldProps} autoFocus className={controlClassName} {...register('type')}>
            <option value="" disabled>
              Оберіть тип…
            </option>
            {POINT_TYPES.map((type) => (
              <option key={type} value={type}>
                {POINT_TYPE_META[type].label}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        label={
          <>
            Опис <span className="font-normal text-slate-400">(необов'язково)</span>
          </>
        }
        error={errors.description?.message}
        hint={`${descriptionLength}/${DESCRIPTION_MAX_LENGTH}`}
      >
        {(fieldProps) => (
          <textarea
            {...fieldProps}
            rows={3}
            className={controlClassName}
            {...register('description')}
          />
        )}
      </FormField>

      {/* Desktop only: on tablet the form sits in a modal drawer over the map, and tapping outside cancels the draft. */}
      <p className="hidden text-xs text-slate-500 lg:block">
        Клікніть в іншому місці поля, щоб перемістити точку.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={stopAdding}>
          Скасувати
        </Button>
        <Button type="submit">Зберегти</Button>
      </div>
    </form>
  );
}
