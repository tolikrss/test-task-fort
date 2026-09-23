import { describe, expect, it } from 'vitest';

import { FieldsDataError, parseFields } from './model';

function validFeature(id = 'field-1') {
  return {
    type: 'Feature',
    properties: { id, name: 'Field', area: 10, crop: 'Wheat' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [30.52, 50.45],
          [30.53, 50.45],
          [30.53, 50.46],
          [30.52, 50.46],
          [30.52, 50.45],
        ],
      ],
    },
  };
}

function collection(...features: unknown[]) {
  return { type: 'FeatureCollection', features };
}

describe('parseFields', () => {
  it('maps a valid collection to fields with computed area', () => {
    const [field] = parseFields(collection(validFeature()));

    expect(field).toMatchObject({
      id: 'field-1',
      name: 'Field',
      crop: 'Wheat',
      declaredAreaHa: 10,
    });
    // Declared 10 ha, but the outline is ≈ 78.7 ha: the UI area comes from the geometry
    expect(field.areaHa).toBeCloseTo(78.72, 1);
  });

  it('rejects an empty collection', () => {
    expect(() => parseFields(collection())).toThrow(FieldsDataError);
  });

  it('rejects a field without a name', () => {
    const feature = validFeature();
    const propertiesWithoutName = { id: 'field-1', area: 10, crop: 'Wheat' };

    expect(() =>
      parseFields(collection({ ...feature, properties: propertiesWithoutName })),
    ).toThrow(FieldsDataError);
  });

  it('rejects an unclosed ring', () => {
    const feature = validFeature();
    const ring = feature.geometry.coordinates[0]?.slice(0, -1);
    const openRing = [...(ring ?? []), [30.52, 50.455]];

    expect(() =>
      parseFields(
        collection({ ...feature, geometry: { type: 'Polygon', coordinates: [openRing] } }),
      ),
    ).toThrow(FieldsDataError);
  });

  it('rejects coordinates out of range', () => {
    const feature = validFeature();
    const ring = [
      [30.52, 95],
      [30.53, 50.45],
      [30.53, 50.46],
      [30.52, 95],
    ];

    expect(() =>
      parseFields(collection({ ...feature, geometry: { type: 'Polygon', coordinates: [ring] } })),
    ).toThrow(FieldsDataError);
  });

  it('rejects duplicate ids', () => {
    expect(() => parseFields(collection(validFeature('a'), validFeature('a')))).toThrow(
      'унікальними',
    );
  });
});
