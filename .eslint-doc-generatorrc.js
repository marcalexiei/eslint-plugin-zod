import prettierConfig from '@marcalexiei/prettier-config';
import * as prettier from 'prettier';

/** @type {import('eslint-doc-generator').GenerateOptions} */
export default {
  postprocess: (content) => {
    /** @type {import('prettier').Options} */
    const options = { parser: 'markdown', ...prettierConfig };
    return prettier.format(content, options);
  },
  configEmoji: [
    ['recommended', '✅'],
    ['recommendedMini', '✔️'],
  ],
  /**
   * @param {Array<[string, import('./src/utils/create-plugin-rule').ZodPluginRule]>} rules
   */
  ruleListSplit(rules) {
    return [
      {
        title: 'Universal rules (`zod` & `zod-mini`)',
        rules: rules.filter(
          ([, rule]) => rule.meta.docs?.zodImportAllowedSource === 'all',
        ),
      },
      {
        title: '`zod` exclusive rules',
        rules: rules.filter(
          ([, rule]) => rule.meta.docs?.zodImportAllowedSource === 'zod',
        ),
      },
      // {
      //   title: '`zod-mini` exclusive rules',
      //   rules: rules.filter(
      //     ([, rule]) =>
      //       rule.meta.docs?.zodImportAllowedSource === 'zod-mini',
      //   ),
      // },
    ];
  },
};
