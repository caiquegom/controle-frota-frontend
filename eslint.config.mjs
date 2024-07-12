// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
