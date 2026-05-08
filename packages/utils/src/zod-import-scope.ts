type ZodImportAllowedSource = 'zod' | 'zod-mini';

const ZodImportSources = ['zod', 'zod/v4', 'zod/v3'] as const;
const ZodMiniImportSources = ['zod/mini', 'zod/v4-mini'] as const;

export class ZodImportScope<
  TSource extends ZodImportAllowedSource = ZodImportAllowedSource,
> {
  readonly sources: TSource extends 'zod'
    ? typeof ZodImportSources
    : typeof ZodMiniImportSources;

  constructor(scope: TSource) {
    this.sources = (
      scope === 'zod' ? ZodImportSources : ZodMiniImportSources
    ) as never;
  }

  isAllowed(source: string): boolean {
    return this.sources.includes(source as never);
  }
}

export const zodImportScope = new ZodImportScope('zod');
export const zodMiniImportScope = new ZodImportScope('zod-mini');
