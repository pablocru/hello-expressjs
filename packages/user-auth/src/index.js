import express from 'express';
import { PORT } from './config.js';

const app = express();

app.get('/', (_request, response) => {
  response.send('Hello, User Auth!');
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

// Close Express when Ctrl + C
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing server');
  server.close(() => {
    console.log('Server closed');
  });
});
