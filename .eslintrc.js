module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'prettier/react'],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.tsx'] },
    },
  },
  rules: {
    // prettier config
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // common
    'import/named': 'off',

    // vue
    'vue/max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
      },
    ],
    'vue/one-component-per-file': 'off',
    'vue/max-attributes-per-line': ['warn', { singleline: 5 }],
    'vue/no-v-html': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
}
