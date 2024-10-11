import type { Application } from 'express';
import { Server } from 'http';

/**
 * Starts the Express Server and stops it gracefully
 */
export function serverLifecycleHandler(
  app: Application,
  port: string | number
): void {
  try {
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    serverShutdownHandler(server);
  } catch (error) {
    if (error instanceof Error) {
      console.error('\nUnexpected error:', error.message);
    } else {
      console.error('\nUnknown error:', error);
      process.exit(1);
    }
  }
}

/**
 * Close Express Server for different signals/events
 */
function serverShutdownHandler(server: Server) {
  // Handle server closure for SIGINT and SIGTERM
  for (const closeSign of ['SIGINT', 'SIGTERM']) {
    process.on(closeSign, () => {
      console.log(`\nClosing server due to ${closeSign}`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  }

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
      console.log('Server closed due to uncaught exception');
      process.exit(1);
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
      console.log('Server closed due to unhandled rejection');
      process.exit(1);
    });
  });
}
