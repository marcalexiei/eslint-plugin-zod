export class ZodImportScope<TSources extends Array<string> = Array<string>> {
  readonly sources: TSources;

  constructor(sources: TSources) {
    this.sources = sources;
  }

  isAllowed(source: string): source is TSources[number] {
    return this.sources.includes(source);
  }
}

export const zodImportScope = new ZodImportScope([
  'zod',
  'zod/v4',
  'zod/v3',
] as const);

export const zodMiniImportScope = new ZodImportScope([
  'zod/mini',
  'zod/v4-mini',
] as const);

export const zodCoreImportScope = new ZodImportScope(['zod/v4/core'] as const);
