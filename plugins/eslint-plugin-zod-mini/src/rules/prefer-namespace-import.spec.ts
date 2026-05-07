import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferNamespaceImport } from './prefer-namespace-import.js';

const ruleTester = new RuleTester();

ruleTester.run(preferNamespaceImport.name, preferNamespaceImport, {
  valid: [
    {
      name: 'namespace import',
      code: 'import * as z from "zod/mini";',
    },
    {
      name: 'aliased namespace import',
      code: 'import * as myZod from "zod/mini";',
    },
    {
      name: 'type namespace import',
      code: 'import type * as myZod from "zod/mini";',
    },
    {
      name: 'unrelated imports',
      code: 'import { useState } from "react";',
    },
    {
      name: 'zod/v4-mini is valid',
      code: 'import * as z from "zod/v4-mini";',
    },
    {
      name: 'not triggered on zod import',
      code: 'import { z } from "zod";',
    },
  ],

  invalid: [
    {
      name: 'named import',
      code: dedent`
        import { z } from "zod/mini";
        const userSchema = z.string();
      `,
      errors: [{ messageId: 'useNamespace' }],
      output: dedent`
        import * as z from "zod/mini";
        const userSchema = z.string();
      `,
    },
    {
      name: 'default import',
      code: 'import z from "zod/mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod/mini";',
    },
    {
      name: 'multiple named imports',
      code: 'import { object, string } from "zod/mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod/mini";',
    },
    {
      name: 'named type import',
      code: 'import type { z } from "zod/mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import type * as z from "zod/mini";',
    },
    {
      name: 'zod/v4-mini default import',
      code: 'import z from "zod/v4-mini";',
      errors: [{ messageId: 'useNamespace' }],
      output: 'import * as z from "zod/v4-mini";',
    },
    {
      name: 'named imports (one value and one type)',
      code: dedent`
        import { z } from "zod/mini";
        import type { $ZodType } from "zod/mini";
        const userSchema: $ZodType = z.string();
      `,
      errors: [
        { messageId: 'useNamespace', line: 1 },
        { messageId: 'removeDuplicate', line: 2 },
        { messageId: 'convertUsage', line: 3 },
      ],
      output: dedent`
        import * as z from "zod/mini";

        const userSchema: z.$ZodType = z.string();
      `,
    },
    {
      name: 'keeps name from named z import',
      code: dedent`
        import { z as myZod } from "zod/mini";
        const userSchema = myZod.string();
      `,
      errors: [{ messageId: 'useNamespace', line: 1 }],
      output: dedent`
        import * as myZod from "zod/mini";
        const userSchema = myZod.string();
      `,
    },
  ],
});
