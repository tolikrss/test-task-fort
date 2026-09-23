import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

/**
 * ESLint runs a single stylistic rule: blank lines between statements.
 * Neither Prettier (it only preserves blank lines, never adds them) nor oxlint can enforce it;
 * all other linting stays in oxlint.
 */
export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', '.claude', 'docs'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        // A blank line after a group of variable declarations…
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        // …but consecutive declarations stay together.
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        // A blank line after if/for/try/function and other block statements.
        { blankLine: 'always', prev: 'block-like', next: '*' },
        // A blank line before every return.
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
];
