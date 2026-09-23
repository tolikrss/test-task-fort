import { describe, expect, it } from 'vitest';

import { getFields } from './fieldsData';

describe('getFields', () => {
  it('loads the 5 sample fields from fields.geojson', () => {
    const fields = getFields();

    expect(fields.map((f) => f.id)).toEqual([
      'field-1',
      'field-2',
      'field-3',
      'field-4',
      'field-5',
    ]);
  });

  it('keeps the declared area of the sample fields in line with their outlines', () => {
    for (const field of getFields()) {
      expect(field.declaredAreaHa).toBeCloseTo(field.areaHa, 1);
    }
  });

  it('caches the result', () => {
    expect(getFields()).toBe(getFields());
  });
});
