import { useId } from 'react';

import { formatAreaHa } from '@/shared/lib/format';

import { useActiveField } from '../hooks/useActiveField';

/** Relative gap between declared and outline-based area above which the user is warned. */
const AREA_MISMATCH_RATIO = 0.05;

export function FieldInfo() {
  const field = useActiveField();
  const titleId = useId();
  const hasAreaMismatch =
    Math.abs(field.areaHa - field.declaredAreaHa) / field.areaHa > AREA_MISMATCH_RATIO;

  return (
    <section aria-labelledby={titleId} className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">Активне поле</p>
      <h2 id={titleId} className="mt-1 text-base font-semibold">
        {field.name}
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Культура</dt>
          <dd>{field.crop}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Площа</dt>
          <dd className="tabular-nums">{formatAreaHa(field.areaHa)}</dd>
        </div>
      </dl>
      {hasAreaMismatch && (
        <p className="mt-2 text-xs text-amber-700">
          У даних вказано {formatAreaHa(field.declaredAreaHa)}; показуємо площу, обчислену з контуру
          поля.
        </p>
      )}
    </section>
  );
}
