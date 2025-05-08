import { defineConfig }   from 'eslint/config'
import globals            from 'globals'
import eslintImportPlugin from 'eslint-plugin-import'
import tsParser           from '@typescript-eslint/parser'
import stylistic          from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: [ '**/*.{js,mjs,cjs,ts}' ],
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    plugins: {
      '@stylistic': stylistic,
      'import': eslintImportPlugin,
    },
    rules: {
      '@stylistic/type-annotation-spacing': [ 'error' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'space-in-parens': [ 'error', 'never' ],
      '@stylistic/interface-name-prefix': 'off',
      '@stylistic/explicit-function-return-type': 'off',
      '@stylistic/no-explicit-any': 'off',
      '@stylistic/no-var-requires': 'off',
      '@stylistic/no-namespace': 'off',
      'quotes': [ 'error', 'single' ],
      'space-before-blocks': 'error',
      'keyword-spacing': [ 'error', { 'after': true } ],
      'key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true, 'mode': 'minimum' } ],
      'object-curly-spacing': [ 'error', 'always' ],
      'newline-before-return': 'error',
      'block-spacing': 'error',
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1,
          'MemberExpression': 1,
          'ignoredNodes': [
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
          ],
        },
      ],
      'semi': [
        'error',
        'never',
      ],
      'linebreak-style': [
        'error',
        'unix',
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1,
        },
      ],
      'arrow-spacing': [ 'error', { 'before': true, 'after': true } ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      '@stylistic/no-duplicate-enum-values': 'off',
      'no-multi-spaces': 'error',
      'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
      'import/newline-after-import': [ 'error', { 'count': 1 } ],
      'space-infix-ops': [ 'error', { 'int32Hint': false } ],
      'no-restricted-imports': [ 'error', {
        'patterns': [ ],
      } ],
    },
  },
]);
