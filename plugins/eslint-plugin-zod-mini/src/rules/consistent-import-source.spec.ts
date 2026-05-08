import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentImportSource } from './consistent-import-source.js';

const ruleTester = new RuleTester();

ruleTester.run(consistentImportSource.name, consistentImportSource, {
  valid: [
    { code: 'import * as z from "zod/mini"' },
    { code: 'import { z } from "zod/mini"' },
    { code: 'import z from "zod/mini"' },
    {
      code: 'import z from "zod/mini"',
      options: [{ sources: ['zod/mini'] }],
    },
    {
      code: 'import z from "zod/v4-mini"',
      options: [{ sources: ['zod/v4-mini'] }],
    },
    {
      name: 'non-zod import is ignored',
      code: 'import z from "react"',
    },
    {
      name: 'non-mini zod import is out of scope',
      code: 'import z from "zod"',
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: 'import * as z from "zod/v4-mini"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4-mini', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod/v4-mini' },
              output: 'import * as z from "zod/mini"',
            },
          ],
        },
      ],
    },
    {
      code: 'import z from "zod/v4-mini"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4-mini', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod/v4-mini' },
              output: 'import z from "zod/mini"',
            },
          ],
        },
      ],
    },
    {
      name: 'should keep quote style',
      code: "import z from 'zod/v4-mini'",
      options: [{ sources: ['zod/mini'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4-mini', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod/v4-mini' },
              output: "import z from 'zod/mini'",
            },
          ],
        },
      ],
    },
  ],
});
