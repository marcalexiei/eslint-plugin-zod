import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithIsFinite } from './no-number-schema-with-is-finite.js';

const ruleTester = new RuleTester();

ruleTester.run(noNumberSchemaWithIsFinite.name, noNumberSchemaWithIsFinite, {
  valid: [
    {
      name: 'z.number() without isFinite',
      code: dedent`
        import * as z from 'zod';
        const n = z.number();
      `,
    },
    {
      name: 'number() without isFinite — named import',
      code: dedent`
        import { number } from 'zod';
        const n = number();
      `,
    },
    {
      name: 'z.number() without isFinite — named z import',
      code: dedent`
        import { z } from 'zod';
        const n = z.number();
      `,
    },
  ],
  invalid: [
    {
      name: 'z.number().isFinite',
      code: dedent`
        import * as z from 'zod';
        void z.number().isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      name: 'z.number().min(0).isFinite',
      code: dedent`
        import * as z from 'zod';
        void z.number().min(0).isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      name: 'number().isFinite — named import',
      code: dedent`
        import { number } from 'zod';
        void number().isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      name: 'z.number().isFinite — named z import',
      code: dedent`
        import { z } from 'zod';
        void z.number().isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
