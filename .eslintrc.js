const baseRules = {
  'prettier/prettier': 'warn',

  'default-case': 'warn',
  'no-console': 'warn',
  'no-debugger': 'warn',
  'no-warning-comments': [
    'warn',
    { terms: ['@todo', '@fixme', 'TODO', 'FIXME'], location: 'anywhere' },
  ],

  'import/no-extraneous-dependencies': [
    'error',
    { devDependencies: ['tests/**/*.ts', 'vite.config.js'] },
  ],
};

const env = {
  browser: true,
  node: true,
};

module.exports = {
  root: true,
  env,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: ['jsdoc', 'prettier'],
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    ...baseRules,

    'no-unused-vars': 'warn',

    'promise/catch-or-return': 'warn',
  },
  settings: {
    jsdoc: {
      mode: 'jsdoc',
    },
  },
  overrides: [
    {
      files: '**/*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:promise/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        ...baseRules,

        'promise/catch-or-return': 'off', // => @typescript-eslint/no-floating-promises

        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        // In case "any" is required, add eslint-disable-next-line and a comment explaining why.
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/typedef': [
          'error',
          {
            arrayDestructuring: true,
            arrowParameter: true,
            memberVariableDeclaration: true,
            objectDestructuring: true,
            parameter: true,
            propertyDeclaration: true,
            variableDeclaration: true,
            variableDeclarationIgnoreFunction: true,
          },
        ],
      },
      settings: {
        jsdoc: {
          mode: 'typescript',
        },
      },
    },
    {
      files: 'src/**/*.ts',
      rules: {
        // JSDoc: https://github.com/gajus/eslint-plugin-jsdoc/tree/master/.README/rules
        'jsdoc/require-description-complete-sentence': 'warn',
        'jsdoc/require-jsdoc': [
          'warn',
          {
            require: {
              ClassDeclaration: true,
              ArrowFunctionExpression: true,
              ClassExpression: true,
              FunctionDeclaration: true,
              FunctionExpression: true,
              MethodDefinition: true,
            },
          },
        ],
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-indentation': 'warn',
        'jsdoc/check-line-alignment': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-syntax': 'warn',
        'jsdoc/check-tag-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/check-values': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/multiline-blocks': 'warn',
        'jsdoc/newline-after-description': 'warn',
        'jsdoc/no-bad-blocks': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/no-types': 'warn',
        'jsdoc/no-undefined-types': 'warn',
        'jsdoc/require-asterisk-prefix': 'warn',
        'jsdoc/require-description': 'warn',
        'jsdoc/require-hyphen-before-param-description': 'warn',
        'jsdoc/require-param': 'warn',
        'jsdoc/require-param-description': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-throws': 'warn',
      },
    },
    {
      files: 'tests/**/*.ts',
      env: {
        ...env,
        jest: true,
      },
    },
  ],
};
