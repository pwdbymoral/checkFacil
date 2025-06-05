import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginNode from 'eslint-plugin-node';

export default [
  {
    ignores: [
      '**/node_modules/',
      '.yarn/',
      '**/dist/',
      '**/build/',
      '**/coverage/',
      '.turbo/',
      '.git/',
      '.DS_Store',
      'client/public/',
      'client/dist/',
      'server/dist/'
    ]
  },
  {
    files: ['client/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './client/tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
      import: eslintPluginImport,
      'react-refresh': eslintPluginReactRefresh
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './client/tsconfig.app.json'
        },
        node: true
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true, ignore: ['^@/'] }],
      'import/prefer-default-export': 'off',
      'import/no-duplicates': 'warn',
      'import/no-cycle': ['error', { maxDepth: 5, ignoreExternal: true }],
      'import/first': 'warn',
      'import/newline-after-import': ['warn', { count: 1 }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'import/no-duplicates': 'warn',
      'import/no-cycle': ['error', { maxDepth: 5, ignoreExternal: true }],
      'import/first': 'warn',
      'import/newline-after-import': ['warn', { count: 1 }]
    }
  },
  {
    files: ['client/src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off'
    }
  },
  {
    files: ['server/src/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      sourceType: 'module'
    },
    plugins: {
      import: eslintPluginImport,
      node: eslintPluginNode
    },
    rules: {
      'import/no-commonjs': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'import/no-duplicates': 'warn',
      'import/no-cycle': ['error', { maxDepth: 5, ignoreExternal: true }],
      'import/first': 'warn',
      'import/newline-after-import': ['warn', { count: 1 }],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },
  eslintConfigPrettier
];
