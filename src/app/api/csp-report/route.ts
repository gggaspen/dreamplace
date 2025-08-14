/**
 * Content Security Policy Report Endpoint
 * Handles CSP violation reports for security monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/infrastructure/security/RateLimiter';
import { InputSanitizer } from '@/infrastructure/security/InputSanitizer';

interface CSPReport {
  'document-uri': string;
  referrer: string;
  'violated-directive': string;
  'effective-directive': string;
  'original-policy': string;
  disposition: string;
  'blocked-uri': string;
  'line-number'?: number;
  'column-number'?: number;
  'source-file'?: string;
  'status-code': number;
  'script-sample'?: string;
}

interface CSPReportWrapper {
  'csp-report': CSPReport;
}

/**
 * Handle CSP violation reports
 */
async function handleCSPReport(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.text();

    // Validate content type
    const contentType = req.headers.get('content-type');
    if (
      !contentType?.includes('application/csp-report') &&
      !contentType?.includes('application/json')
    ) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Parse and sanitize the report
    const sanitizedJson = InputSanitizer.sanitizeJson<CSPReportWrapper>(body);
    if (!sanitizedJson || !sanitizedJson['csp-report']) {
      return NextResponse.json({ error: 'Invalid CSP report format' }, { status: 400 });
    }

    const report = sanitizedJson['csp-report'];

    // Validate required fields
    if (!report['document-uri'] || !report['violated-directive']) {
      return NextResponse.json({ error: 'Missing required CSP report fields' }, { status: 400 });
    }

    // Log the violation (in production, send to monitoring service)
    const logEntry = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      documentUri: report['document-uri'],
      violatedDirective: report['violated-directive'],
      effectiveDirective: report['effective-directive'],
      blockedUri: report['blocked-uri'],
      sourceFile: report['source-file'],
      lineNumber: report['line-number'],
      columnNumber: report['column-number'],
      scriptSample: report['script-sample'],
      disposition: report.disposition,
      statusCode: report['status-code'],
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.warn('CSP Violation:', logEntry);
    }

    // In production, you would send this to your monitoring service
    // Example: await sendToMonitoring(logEntry);
    await logCSPViolation(logEntry);

    return NextResponse.json({ status: 'ok' }, { status: 204 });
  } catch (error) {
    console.error('CSP report processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Log CSP violation to monitoring system
 */
async function logCSPViolation(violation: any): Promise<void> {
  try {
    // In a real application, this would send to your monitoring service
    // Examples: Sentry, DataDog, CloudWatch, etc.

    if (process.env.SENTRY_DSN) {
      // Example Sentry integration
      // Sentry.captureMessage('CSP Violation', 'warning', { extra: violation });
    }

    if (process.env.WEBHOOK_URL) {
      // Example webhook integration
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'csp_violation',
          data: violation,
        }),
      });
    }

    // Store in database for analysis
    // await db.cspViolations.create({ data: violation });
  } catch (error) {
    console.error('Failed to log CSP violation:', error);
  }
}

/**
 * Rate limited POST handler
 */
export const POST = withRateLimit(
  'csp-report',
  handleCSPReport,
  req => req.headers.get('x-forwarded-for') || req.ip || 'unknown'
);

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
