import { handleServerShutdown } from '@hello-expressjs/server-shutdown-handler';
import { PORT } from '@hello-expressjs/environment-config';
import { UserRepository } from './user-repository.js';
import express from 'express';

const app = express();

// Specify template engine that is EJS (Embedded JavaScript Templates)
// -> https://ejs.co/
app.set('view engine', 'ejs');

// Middleware to process JSON
app.use(express.json());

app.get('/', (_request, response) => {
  response.render('index');
});

app.post('/login', async (request, response) => {
  try {
    const loggedUserId = await UserRepository.login(request.body);
    response.send({ loggedUserId });
  } catch (error) {
    response.status(401).send({ message: error.message });
  }
});

app.post('/register', async (request, response) => {
  try {
    const newUserId = await UserRepository.create(request.body);
    response.send({ newUserId });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

handleServerShutdown(server);