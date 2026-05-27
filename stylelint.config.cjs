module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue'],
  rules: {
    'no-descending-specificity': null,
    'selector-max-compound-selectors': 4,
  },
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**'],
}