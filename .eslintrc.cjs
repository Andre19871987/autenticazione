module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:eqeqeq-fix/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    root: true,
    overrides: [
        {
            env: {
                node: true
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    ignorePatterns: ['dist/**/*'],
    rules: {
        eqeqeq: 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': ['warn'],
        'prettier/prettier': [
            1,
            {
                bracketSpacing: true,
                printWidth: 120,
                singleQuote: true,
                trailingComma: 'none',
                tabWidth: 4,
                useTabs: false,
                endOfLine: 'auto'
            }
        ]
    }
};
