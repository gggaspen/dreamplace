import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Integration settings
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/dreamplace\.com\.ar/,
        /^https:\/\/.*\.railway\.app/,
      ],
    }),
  ],

  // Error filtering
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Filter out network errors that are expected
    if (hint.originalException instanceof Error) {
      const message = hint.originalException.message;
      if (
        message.includes('Network Error') ||
        message.includes('Failed to fetch') ||
        message.includes('Load failed')
      ) {
        return null;
      }
    }

    return event;
  },

  // Additional context
  initialScope: {
    tags: {
      component: 'client',
    },
  },
});
