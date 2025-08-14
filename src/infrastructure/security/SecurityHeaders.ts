/**
 * Security Headers Configuration
 * Implements comprehensive Content Security Policy and other security headers
 */

export interface SecurityConfig {
  env: 'development' | 'production' | 'test';
  enableCSP: boolean;
  enableHSTS: boolean;
  reportUri?: string;
  nonce?: string;
}

export class SecurityHeaders {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  /**
   * Generate Content Security Policy header value
   */
  generateCSP(): string {
    const nonce = this.config.nonce ? `'nonce-${this.config.nonce}'` : '';
    
    const cspDirectives = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        ...(this.config.env === 'development' ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
        nonce,
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://connect.facebook.net',
        'https://js.stripe.com',
        'https://www.gstatic.com',
        'https://apis.google.com'
      ].filter(Boolean),
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for Chakra UI and styled-components
        'https://fonts.googleapis.com',
        'https://use.typekit.net'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'https://i.postimg.cc',
        'https://res.cloudinary.com',
        'https://dreamplace.com.ar',
        'https://images.unsplash.com',
        'https://www.google-analytics.com',
        'https://www.facebook.com'
      ],
      'font-src': [
        "'self'",
        'data:',
        'https://fonts.gstatic.com',
        'https://use.typekit.net'
      ],
      'connect-src': [
        "'self'",
        'https://api.stripe.com',
        'https://*.googleapis.com',
        'https://*.firebaseapp.com',
        'https://*.firebase.com',
        'https://www.google-analytics.com',
        'https://vitals.vercel-insights.com',
        ...(this.config.reportUri ? [this.config.reportUri] : [])
      ],
      'frame-src': [
        "'self'",
        'https://js.stripe.com',
        'https://hooks.stripe.com',
        'https://www.youtube.com',
        'https://open.spotify.com'
      ],
      'worker-src': [
        "'self'",
        'blob:'
      ],
      'child-src': [
        "'self'",
        'blob:'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': this.config.env === 'production' ? [] : null
    };

    // Build CSP string
    const cspParts: string[] = [];
    
    Object.entries(cspDirectives).forEach(([directive, sources]) => {
      if (sources === null) return;
      
      if (Array.isArray(sources) && sources.length > 0) {
        cspParts.push(`${directive} ${sources.join(' ')}`);
      } else if (sources.length === 0) {
        cspParts.push(directive);
      }
    });

    // Add report directives in production
    if (this.config.env === 'production' && this.config.reportUri) {
      cspParts.push(`report-uri ${this.config.reportUri}`);
      cspParts.push(`report-to csp-endpoint`);
    }

    return cspParts.join('; ');
  }

  /**
   * Get all security headers
   */
  getAllHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      // Content Security Policy
      'Content-Security-Policy': this.generateCSP(),
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Content Type Options
      'X-Content-Type-Options': 'nosniff',
      
      // Frame Options
      'X-Frame-Options': 'DENY',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permissions Policy
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=(self)',
        'usb=()',
        'bluetooth=()',
        'magnetometer=()',
        'accelerometer=()',
        'gyroscope=()',
        'ambient-light-sensor=()'
      ].join(', '),
      
      // Cross-Origin Embedder Policy
      'Cross-Origin-Embedder-Policy': 'credentialless',
      
      // Cross-Origin Opener Policy
      'Cross-Origin-Opener-Policy': 'same-origin',
      
      // Cross-Origin Resource Policy
      'Cross-Origin-Resource-Policy': 'cross-origin'
    };

    // Add HSTS header for production
    if (this.config.env === 'production' && this.config.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    // Add CSP Report-To header for production
    if (this.config.env === 'production' && this.config.reportUri) {
      headers['Report-To'] = JSON.stringify({
        group: 'csp-endpoint',
        max_age: 10886400,
        endpoints: [{ url: this.config.reportUri }]
      });
    }

    return headers;
  }

  /**
   * Generate a random nonce for CSP
   */
  static generateNonce(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto.getRandomValues
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSP directive
   */
  static validateCSPDirective(directive: string, sources: string[]): boolean {
    const validDirectives = [
      'default-src', 'script-src', 'style-src', 'img-src', 'font-src',
      'connect-src', 'frame-src', 'worker-src', 'child-src', 'object-src',
      'base-uri', 'form-action', 'frame-ancestors', 'upgrade-insecure-requests'
    ];

    if (!validDirectives.includes(directive)) {
      return false;
    }

    // Validate sources
    const validSourceKeywords = [
      "'self'", "'unsafe-inline'", "'unsafe-eval'", "'none'", "'strict-dynamic'"
    ];

    return sources.every(source => {
      // Allow valid keywords
      if (validSourceKeywords.includes(source)) return true;
      
      // Allow nonce sources
      if (source.startsWith("'nonce-")) return true;
      
      // Allow hash sources
      if (source.match(/^'(sha256|sha384|sha512)-[A-Za-z0-9+/=]+'$/)) return true;
      
      // Allow URLs (basic validation)
      try {
        new URL(source);
        return true;
      } catch {
        // Allow scheme sources like https:, data:, blob:
        return source.match(/^[a-z][a-z0-9+.-]*:$/);
      }
    });
  }
}

/**
 * Default security configuration factory
 */
export function createSecurityConfig(
  env: SecurityConfig['env'] = 'production',
  overrides?: Partial<SecurityConfig>
): SecurityConfig {
  const defaults: SecurityConfig = {
    env,
    enableCSP: true,
    enableHSTS: env === 'production',
    reportUri: env === 'production' ? '/api/csp-report' : undefined,
    nonce: SecurityHeaders.generateNonce()
  };

  return { ...defaults, ...overrides };
}