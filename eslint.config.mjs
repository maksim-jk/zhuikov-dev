import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  // Avoid duplicating plugins (Nuxt preset already includes them)
  standalone: false,
  features: {
    stylistic: true,
    typescript: true,
  },
})
  .append({
    rules: {
      // JS/TS naming & correctness
      'camelcase': ['error', { properties: 'never', ignoreDestructuring: false }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      // Vue style
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',

      // Imports (plugin already provided by Nuxt preset)
      'import/order': ['error', {
        'groups': [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index'], ['type']],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true },
      }],
    },
  })
