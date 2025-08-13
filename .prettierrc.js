/**
 * Prettier Configuration for DreamPlace
 *
 * This configuration ensures consistent code formatting across the entire project.
 * It follows industry best practices and is optimized for TypeScript/React development.
 */

module.exports = {
  // Basic formatting options
  semi: true, // Always use semicolons
  trailingComma: 'es5', // Trailing commas where valid in ES5 (objects, arrays, etc.)
  singleQuote: true, // Use single quotes for strings
  quoteProps: 'as-needed', // Only quote object properties when needed

  // Indentation and spacing
  tabWidth: 2, // 2 spaces for indentation
  useTabs: false, // Use spaces instead of tabs

  // Line length and wrapping
  printWidth: 100, // Line length that Prettier will wrap on

  // JSX specific formatting
  jsxSingleQuote: true, // Use single quotes in JSX

  // Other formatting options
  bracketSpacing: true, // Print spaces between brackets in object literals
  bracketSameLine: false, // Put the > of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line
  arrowParens: 'avoid', // Omit parentheses when possible for arrow functions

  // End of line handling
  endOfLine: 'lf', // Use LF line endings (Unix style)

  // File type specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 2,
        printWidth: 80,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        tabWidth: 2,
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.css',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: true,
      },
    },
  ],
};
