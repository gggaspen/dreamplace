'use client';

/**
 * Error Display Presentation Component
 *
 * Pure presentational component for displaying error messages.
 * Reusable across the application for consistent error styling.
 */

import React from 'react';

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(
  ({ message, title = 'Error loading application!' }) => {
    return (
      <div style={{ padding: '2rem', maxWidth: '28rem', margin: '2.5rem auto' }}>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fed7d7',
            color: '#c53030',
            borderRadius: '0.375rem',
            border: '1px solid #feb2b2',
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
          <p>{message}</p>
        </div>
      </div>
    );
  }
);
