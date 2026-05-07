import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { consistentSchemaVarName } from './consistent-schema-var-name.js';

const ruleTester = new RuleTester();

ruleTester.run(consistentSchemaVarName.name, consistentSchemaVarName, {
  valid: [
    {
      name: 'valid (default suffix)',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.string();
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod/mini';
        const userSchema = string();
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        const userSchema = z.string();
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
      name: 'ignores non-zod/mini',
      code: dedent`
        import * as z from 'zod/mini';
        const myVar = 1
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        const myVar = z.string();
      `,
    },
    {
      name: 'custom suffix',
      code: dedent`
        import * as z from 'zod/mini';
        const userVar = z.string();
      `,
      options: [{ after: 'Var' }],
    },
    {
      name: 'prefix only',
      code: dedent`
        import * as z from 'zod/mini';
        const $user = z.string();
      `,
      options: [{ before: '$', after: '' }],
    },
    {
      name: 'both prefix and suffix',
      code: dedent`
        import * as z from 'zod/mini';
        const $userSchema = z.string();
      `,
      options: [{ before: '$', after: 'Schema' }],
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
      errors: [{ messageId: 'invalidName', data: { expected: 'myVarSchema' } }],
      output: null,
    },
    {
      name: 'named import (missing suffix)',
      code: dedent`
        import { string } from 'zod/mini';
        const myVar = string();
      `,
      errors: [{ messageId: 'invalidName', data: { expected: 'myVarSchema' } }],
      output: null,
    },
    {
      name: 'missing prefix only',
      code: dedent`
        import * as z from 'zod/mini';
        const user = z.string();
      `,
      options: [{ before: '$', after: '' }],
      errors: [{ messageId: 'invalidName', data: { expected: '$user' } }],
      output: null,
    },
    {
      name: 'missing both prefix and suffix',
      code: dedent`
        import * as z from 'zod/mini';
        const user = z.string();
      `,
      options: [{ before: '$', after: 'Schema' }],
      errors: [{ messageId: 'invalidName', data: { expected: '$userSchema' } }],
      output: null,
    },
    {
      name: 'zod/v4-mini import (missing suffix)',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const myVar = z.string();
      `,
      errors: [{ messageId: 'invalidName', data: { expected: 'myVarSchema' } }],
      output: null,
    },
  ],
});
