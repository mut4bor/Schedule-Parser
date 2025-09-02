import parser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['src/**/*.{js,js,ts,ts}'],
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        browser: true,
        node: true,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    rules: {
      semi: ['error', 'never'],

      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]
