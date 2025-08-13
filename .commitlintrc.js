/**
 * Commitlint Configuration for DreamPlace
 *
 * This configuration enforces conventional commit messages to ensure
 * consistent and meaningful commit history. It follows the Angular
 * convention with some customizations for the project.
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],

  // Custom rules for DreamPlace project
  rules: {
    // Type must be one of the defined types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, missing semicolons, etc.)
        'refactor', // Code refactoring without changing functionality
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Changes to build process or dependencies
        'ci', // CI/CD related changes
        'chore', // Maintenance tasks, housekeeping
        'revert', // Reverting previous changes
        'wip', // Work in progress (use sparingly)
        'security', // Security improvements or fixes
        'ui', // User interface changes
        'ux', // User experience improvements
        'a11y', // Accessibility improvements
        'i18n', // Internationalization
        'config', // Configuration changes
        'deps', // Dependency updates
        'release', // Release preparation
      ],
    ],

    // Subject case should be lower case
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],

    // Subject should not be empty
    'subject-empty': [2, 'never'],

    // Subject maximum length
    'subject-max-length': [2, 'always', 100],

    // Type should not be empty
    'type-empty': [2, 'never'],

    // Type case should be lowercase
    'type-case': [2, 'always', 'lower-case'],

    // Header maximum length (including type, scope, and subject)
    'header-max-length': [2, 'always', 100],

    // Body should wrap at 72 characters
    'body-max-line-length': [2, 'always', 72],

    // Footer should wrap at 72 characters
    'footer-max-line-length': [2, 'always', 72],
  },

  // Help URL for commit message format
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};
