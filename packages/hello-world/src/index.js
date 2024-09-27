import { PORT } from '@hello-expressjs/config';
import { sigintServer } from '@hello-expressjs/sigint-server';
import express from 'express';

const app = express();

app.get('/', (_request, response) => {
  response.send('Hello, Express.js!');
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

sigintServer(server);
