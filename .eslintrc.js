module.exports = {
    'env': {
        'node': true,
        'es2021': true
    },
    'globals': {
        'logger': 'writable',
        'client': 'writable',
        'dontRestart': 'writable'
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            process.platform === 'win32' ? 'windows' : 'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'comma-dangle': [
            'error',
            'never'
        ]
    }
};