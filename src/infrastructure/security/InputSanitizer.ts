/**
 * Input Sanitization and XSS Protection Utilities
 * Provides comprehensive input sanitization for preventing XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify';

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowedSchemes?: string[];
  stripTags?: boolean;
  maxLength?: number;
}

export class InputSanitizer {
  private static readonly DEFAULT_ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'a', 'img'
  ];

  private static readonly DEFAULT_ALLOWED_ATTRIBUTES = [
    'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'
  ];

  private static readonly DEFAULT_ALLOWED_SCHEMES = [
    'http', 'https', 'mailto', 'tel'
  ];

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(
    input: string,
    options: SanitizationOptions = {}
  ): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const {
      allowedTags = this.DEFAULT_ALLOWED_TAGS,
      allowedAttributes = this.DEFAULT_ALLOWED_ATTRIBUTES,
      allowedSchemes = this.DEFAULT_ALLOWED_SCHEMES,
      maxLength
    } = options;

    // Truncate if max length specified
    let sanitizedInput = maxLength ? input.slice(0, maxLength) : input;

    // Configure DOMPurify
    const config = {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ALLOWED_URI_REGEXP: new RegExp(`^(?:(?:${allowedSchemes.join('|')}):)`, 'i'),
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,
      SANITIZE_DOM: true,
      FORBID_CONTENTS: ['script', 'style'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onkeypress', 'onkeydown', 'onkeyup']
    };

    return DOMPurify.sanitize(sanitizedInput, config);
  }

  /**
   * Sanitize plain text by removing all HTML tags
   */
  static sanitizeText(input: string, maxLength?: number): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove all HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    sanitized = this.decodeHtmlEntities(sanitized);
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Truncate if max length specified
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.slice(0, maxLength).trim() + '...';
    }

    return sanitized;
  }

  /**
   * Sanitize URL to prevent javascript: and other dangerous schemes
   */
  static sanitizeUrl(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const url = input.trim().toLowerCase();
    
    // Block dangerous schemes
    const dangerousSchemes = [
      'javascript:', 'data:', 'vbscript:', 'file:', 'about:',
      'chrome:', 'chrome-extension:', 'ms-help:', 'ms-its:', 'mhtml:',
      'livescript:', 'mocha:'
    ];

    if (dangerousSchemes.some(scheme => url.startsWith(scheme))) {
      return '';
    }

    // Allow relative URLs and safe absolute URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return input.trim();
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return input.trim();
    }

    // For URLs without protocol, prepend https://
    if (url.includes('.') && !url.includes(' ')) {
      return `https://${input.trim()}`;
    }

    return '';
  }

  /**
   * Sanitize email address
   */
  static sanitizeEmail(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const email = input.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return emailRegex.test(email) ? email : '';
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove all non-digit characters except + and -
    const phone = input.replace(/[^\d+\-\s()]/g, '');
    
    // Basic phone number validation (minimum 7 digits)
    const digitCount = phone.replace(/[^\d]/g, '').length;
    
    return digitCount >= 7 && digitCount <= 15 ? phone.trim() : '';
  }

  /**
   * Sanitize filename to prevent directory traversal
   */
  static sanitizeFilename(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove directory traversal patterns
    let filename = input.replace(/\.\./g, '');
    
    // Remove path separators
    filename = filename.replace(/[\/\\]/g, '');
    
    // Remove dangerous characters
    filename = filename.replace(/[<>:"|?*]/g, '');
    
    // Limit length
    if (filename.length > 255) {
      const ext = filename.split('.').pop();
      const name = filename.slice(0, 250 - (ext ? ext.length + 1 : 0));
      filename = ext ? `${name}.${ext}` : name;
    }

    return filename.trim();
  }

  /**
   * Validate and sanitize JSON input
   */
  static sanitizeJson<T = any>(input: string): T | null {
    if (!input || typeof input !== 'string') {
      return null;
    }

    try {
      const parsed = JSON.parse(input);
      
      // Recursively sanitize string values in the object
      return this.deepSanitizeObject(parsed);
    } catch {
      return null;
    }
  }

  /**
   * Deep sanitize object properties
   */
  private static deepSanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeText(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize both key and value
        const sanitizedKey = this.sanitizeText(key);
        sanitized[sanitizedKey] = this.deepSanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Decode HTML entities
   */
  private static decodeHtmlEntities(input: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#39;': "'",
      '&#47;': '/'
    };

    return input.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
  }

  /**
   * Check if string contains potential XSS patterns
   */
  static containsXSSPatterns(input: string): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
      /expression\s*\(/gi,
      /url\s*\(\s*javascript:/gi,
      /@import\s+['"]/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Validate input against whitelist
   */
  static validateAgainstWhitelist(
    input: string,
    whitelist: string[],
    caseSensitive = false
  ): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }

    const checkValue = caseSensitive ? input : input.toLowerCase();
    const checkList = caseSensitive ? whitelist : whitelist.map(item => item.toLowerCase());

    return checkList.includes(checkValue);
  }

  /**
   * Rate limiting helper for input validation
   */
  static createRateLimiter(maxAttempts: number, windowMs: number) {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    return (identifier: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(identifier);

      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (userAttempts.count >= maxAttempts) {
        return false;
      }

      userAttempts.count++;
      return true;
    };
  }
}