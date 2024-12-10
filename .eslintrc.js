module.exports = {
  root: true,
  env: {
    node: true,  // Add Node.js environment
    browser: true  // Keep browser environment if needed
  },
  extends: [
    'plugin:vue/vue3-essential'
  ],
  plugins:[
    'import'
  ],
  rules: {
    'import/first': 'error',
    // Semicolons and Formatting
    'semi': ['error', 'always'],  // You use semicolons consistently
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],  // You use single quotes
    'comma-dangle': ['error', 'never'],  // No trailing commas

    // Spacing
    'indent': 'off',  // Disabled indentation rule
    'object-curly-spacing': ['error', 'always'],  // Spaces inside curly braces
    'array-bracket-spacing': ['error', 'never'],  // No spaces inside array brackets
    'space-before-function-paren': 'off',  // Disable space before function parentheses
    'space-before-blocks': ['error', 'always'],  // Space before blocks
    'keyword-spacing': ['error', { 'before': true, 'after': true }],  // Spaces around keywords

    // Vue Specific
    'vue/html-indent': 'off',  // Disabled Vue template indentation
    'vue/script-indent': 'off',  // Disabled Vue script indentation
    'vue/max-attributes-per-line': 0,
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline': 'always'
    }],

    // ES6
    'arrow-spacing': ['error', { 'before': true, 'after': true }],  // Spaces around arrow functions
    'arrow-parens': 0,  // Disable arrow parentheses rule completely

    // Variables and Functions
    'no-unused-vars': ['warn'],  // Warn about unused variables
    'no-var': 'error',  // Use let/const instead of var
    'prefer-const': ['error', { 'destructuring': 'all' }],  // Use const when possible

    // Comments
    'spaced-comment': ['error', 'always'],  // Space after comment slashes

    // Allow certain patterns you use
    'no-mixed-operators': 'off',  // You use mixed operators in math calculations
    'operator-linebreak': 'off',  // Allow flexible operator linebreaks
    'multiline-ternary': 'off',  // Allow flexible ternary formatting

    // Error Prevention
    'no-console': 'off',  // Console statements are allowed
    'no-debugger': 'warn',  // Warn about debugger statements
    'no-undef': 'error',  // Error on undefined variables

    // Import/Export
    'import/first': 'error',  // Imports first
    'import/no-duplicates': 'error',  // No duplicate imports
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never'
    }]
  }
};
