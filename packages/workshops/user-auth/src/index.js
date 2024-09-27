import { PORT } from '@hello-expressjs/environment-config';
import { handleServerShutdown } from '@hello-expressjs/server-shutdown-handler';
import express from 'express';

const app = express();

app.get('/', (_request, response) => {
  response.send('Hello, User Auth!');
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

handleServerShutdown(server);
