// Configuration ESLint v9 (flat config) — racine du projet
module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      'frontend/.next/**',
      'frontend/build/**',
      'frontend/out/**',
      'frontend/public/**',
      'test_reports/**',
      'memory/**',
    ],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
