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
      // '@stylistic/curly-newline': ["error", {
      //   "ForInStatement": "always",
      //   "ForOfStatement": { "multiline": true },
      //   "ForStatement": "never",
      //   "WhileStatement": { "multiline": true, "minElements": 3, "consistent": true }
      // }],
      '@stylistic/explicit-function-return-type': 'off',
      '@stylistic/interface-name-prefix': 'off',
      '@stylistic/no-explicit-any': 'off',
      '@stylistic/no-var-requires': 'off',
      '@stylistic/no-namespace': 'off',
      '@stylistic/no-duplicate-enum-values': 'off',
      '@stylistic/indent-binary-ops': [ 'error', 2 ],
      // '@stylistic/type-annotation-spacing': [ 'error' ],
      '@stylistic/no-multi-spaces': [ 'warn', {
        exceptions: {
          ImportDeclaration: true,
          VariableDeclarator: true,
          Property: true,
        },
      },
      ],
      
      'spaced-comment': [ 'error', 'always', {
        'line': {
          'markers': [ '/' ],
          'exceptions': [ '-', '+' ],
        },
        'block': {
          'markers': [ '!' ],
          'exceptions': [ '*' ],
          'balanced': true,
        },
      } ],
      
      // align object values
      '@stylistic/key-spacing': [ 'error', {
        'beforeColon': false,
        'afterColon': true,
        'mode': 'minimum',
        'align': {
          on: 'colon',
          beforeColon: false,
          afterColon: true,
        },
      } ],
      
      
      '@stylistic/array-bracket-spacing': [ 'error', 'always', { arraysInArrays: false } ],
      'block-spacing': 'error',
      
      'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
      'comma-dangle': [ 'error', 'only-multiline' ],
      'comma-style': [ 'error', 'last' ],
      
      
      'quotes': [ 'error', 'single' ],
      'space-in-parens': [ 'error', 'never' ],
      'space-before-blocks': 'error',
      '@stylistic/keyword-spacing': [ 'error', { 'before': true, 'after': true } ],
      '@stylistic/space-before-function-paren': [ 'error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always',
        'catch': 'always',
      } ],
      
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      'newline-before-return': 'error',
      
      'indent': [ 'error', 2,
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
      'no-multiple-empty-lines': [ 'error', {
        'max': 1,
      } ],
      'arrow-spacing': [ 'error', { 'before': true, 'after': true } ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
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
      '@stylistic/space-infix-ops': [ 'error', { int32Hint: false } ],
      'no-restricted-imports': [ 'off', { 'patterns': [ '.*' ] } ],
    },
  },
]);
