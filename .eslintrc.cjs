module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  overrides: (() => {
    const domains = ['accelerator', 'arena', 'insurance', 'stocks']
    const maxDepth = 6

    const up = (n, p) => '../'.repeat(n) + p

    const otherDomainImportPatterns = self =>
      domains
        .filter(d => d !== self)
        .flatMap(d =>
          Array.from({ length: maxDepth }, (_, i) => up(i + 1, `${d}/**`))
        )

    const restrictedWalletLibs = [
      {
        name: 'wagmi',
        message: "Do not import 'wagmi' in domains. Use src/wallet/* as the only wallet entry.",
      },
      {
        name: '@rainbow-me/rainbowkit',
        message:
          "Do not import '@rainbow-me/rainbowkit' in domains. Use src/wallet/* as the only wallet entry.",
      },
    ]

    const domainOverride = self => ({
      files: [`src/domains/${self}/**/*.{ts,tsx}`],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: restrictedWalletLibs,
            patterns: [
              {
                group: otherDomainImportPatterns(self),
                message:
                  'Cross-domain imports are not allowed. Use shared/ or app-level composition instead.',
              },
            ],
          },
        ],
      },
    })

    return domains.map(domainOverride)
  })(),
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
  },
}
