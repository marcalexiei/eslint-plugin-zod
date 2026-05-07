export type ZodImportAllowedSource = 'zod' | 'zod-mini';

export const ZOD_IMPORT_SOURCES = [
  'zod',
  'zod/mini',
  'zod/v4',
  'zod/v4-mini',
  'zod/v3',
] as const;

export type ZodImportSource = (typeof ZOD_IMPORT_SOURCES)[number];

export function isZodImportSource(
  source: string,
  allowedSource: ZodImportAllowedSource,
): boolean {
  const allowedSources: Array<ZodImportSource> =
    allowedSource === 'zod'
      ? ['zod', 'zod/v4', 'zod/v3']
      : ['zod/mini', 'zod/v4-mini'];

  return allowedSources.includes(source as ZodImportSource);
}
