import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        server: 'ok',
        memory: 'ok',
        api: 'ok', // Could check API connectivity here
      },
    };

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const maxMemory = 512 * 1024 * 1024; // 512MB limit

    if (memoryUsage.heapUsed > maxMemory * 0.9) {
      healthStatus.checks.memory = 'warning';
    }

    // Memory info available for future use
    // const memoryInfo = getMemoryUsage();

    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// Utility function for memory usage (available for future use)
// function getMemoryUsage() {
//   const usage = process.memoryUsage();
//   return {
//     rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
//     heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
//     heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
//     external: Math.round(usage.external / 1024 / 1024 * 100) / 100,
//   };
// }
