import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noEmptyCustomSchema } from './no-empty-custom-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noEmptyCustomSchema.name, noEmptyCustomSchema, {
  valid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod';
        z.custom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'named',
      code: dedent`
        import { custom } from 'zod';
        custom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'named renamed',
      code: dedent`
        import { custom as zCustom } from 'zod';
        zCustom((val) => typeof val === "string" ? /^\\d+px$/.test(val) : false);
      `,
    },
    {
      name: 'type and function',
      code: dedent`
        import * as z from 'zod';
        z.custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
    {
      name: 'type and function (named)',
      code: dedent`
        import { custom } from 'zod';
        custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/237
      name: 'should not error when custom schema is chained with optional method',
      code: dedent`
        import * as z from 'zod';

        export const test6Schema = z
          .custom((val) => typeof val === 'string', {
            error: 'Error',
          })
          .optional();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'named',
      code: dedent`
        import { custom } from 'zod';
        custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'named z',
      code: dedent`
        import { z } from 'zod';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function',
      code: dedent`
        import * as z from 'zod';
        z.custom<\`\${number}px\`>();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function (named)',
      code: dedent`
        import { custom } from 'zod';
        custom<\`\${number}px\`>();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/237
      name: 'empty custom schema is chained with optional method',
      code: dedent`
        import * as z from 'zod';

        export const test6Schema = z.custom().optional();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
  ],
});
