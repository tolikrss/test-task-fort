import { describe, expect, it } from 'vitest';

import { findFieldAt } from './fieldLookup';

describe('findFieldAt', () => {
  it('returns the field that contains the point', () => {
    expect(findFieldAt({ lat: 50.425, lng: 30.865 })?.id).toBe('field-2');
    expect(findFieldAt({ lat: 50.424, lng: 30.912 })?.id).toBe('field-3');
  });

  it('returns undefined for a point outside every field', () => {
    expect(findFieldAt({ lat: 50.46, lng: 30.84 })).toBeUndefined();
  });
});
