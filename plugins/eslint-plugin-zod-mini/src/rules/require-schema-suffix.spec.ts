import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireSchemaSuffix } from './require-schema-suffix.js';

const ruleTester = new RuleTester();

ruleTester.run(requireSchemaSuffix.name, requireSchemaSuffix, {
  valid: [
    {
      name: 'valid (default suffix)',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.string();
      `,
    },
    {
      name: 'valid with multiple declarations',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.string(), addressSchema = z.object({ street: z.string() });
      `,
    },
    {
      name: 'with parse()',
      code: dedent`
        import * as z from 'zod/mini';
        const value = z.string().parse("asd")
      `,
    },
    {
      name: 'custom suffix',
      code: dedent`
        import * as z from 'zod/mini';
        const userVar = z.string()
      `,
      options: [{ suffix: 'Var' }],
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        const myVar = z.string();
      `,
    },
    {
      name: 'ignores non-zod/mini values',
      code: dedent`
        import * as z from 'zod/mini';
        const myVar = 1
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const userSchema = z.string();
      `,
    },
  ],

  invalid: [
    {
      name: 'namespace (missing suffix)',
      code: dedent`
        import * as z from 'zod/mini';
        const myVar = z.string();
      `,
      errors: [
        {
          messageId: 'noSchemaSuffix',
          data: { suffix: 'Schema', expected: 'myVarSchema' },
        },
      ],
      output: null,
    },
    {
      name: 'named import (missing suffix)',
      code: dedent`
        import { string } from 'zod/mini';
        const myVar = string();
      `,
      errors: [
        {
          messageId: 'noSchemaSuffix',
          data: { suffix: 'Schema', expected: 'myVarSchema' },
        },
      ],
      output: null,
    },
    {
      name: 'chained method (missing suffix)',
      code: dedent`
        import * as z from 'zod/mini';
        const myVar = z.string().check(z.min(1));
      `,
      errors: [
        {
          messageId: 'noSchemaSuffix',
          data: { suffix: 'Schema', expected: 'myVarSchema' },
        },
      ],
      output: null,
    },
    {
      name: 'custom suffix (missing)',
      code: dedent`
        import * as z from 'zod/mini';
        const myString = z.string()
      `,
      options: [{ suffix: '_schema' }],
      errors: [
        {
          messageId: 'noSchemaSuffix',
          data: { suffix: '_schema', expected: 'myString_schema' },
        },
      ],
      output: null,
    },
    {
      name: 'zod/v4-mini import (missing suffix)',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const myVar = z.string();
      `,
      errors: [
        {
          messageId: 'noSchemaSuffix',
          data: { suffix: 'Schema', expected: 'myVarSchema' },
        },
      ],
      output: null,
    },
  ],
});
