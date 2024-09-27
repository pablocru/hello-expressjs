/**
 * Close Express Server when typing `Ctrl + C`
 */
export function sigintServer(server) {
  process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing server');
    server.close(() => {
      console.log('Server closed');
    });
  });
}
