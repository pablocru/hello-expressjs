import { fileURLToPath } from 'url';
import { handleServerShutdown } from '@hello-expressjs/server-shutdown-handler';
import { PORT } from '@hello-expressjs/environment-config';
import { UserRepository } from './user-repository.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';

const JWT_COOKIE_NAME = 'access_token';
const JWT_SECRET_KEY =
  'in-real-scenarios-please-do-not-leave-this-secret-hardcoded-here' +
  '-use-environment-variables-instead' +
  '-also-use-numbers-and-symbols' +
  '-it-is-even-better-to-hash-or-encode-this-secret';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Specify template engine that is EJS (Embedded JavaScript Templates)
// -> https://ejs.co/
app.set('view engine', 'ejs');

// Middlewares
// -> to process JSON
app.use(express.json());

// -> to manage Cookies
app.use(cookieParser());

// -> to process the JWT & Session
app.use((request, _response, next) => {
  const token = request.cookies[JWT_COOKIE_NAME];

  request.session = { user: null };

  try {
    const data = jwt.verify(token, JWT_SECRET_KEY);

    request.session.user = data;
  } catch {}

  next(); // Go to the next route/middleware
});

// -> to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (request, response) => {
  const { user } = request.session;

  response.render('index', user);
});

app.post('/login', async (request, response) => {
  try {
    const loggedUser = await UserRepository.login(request.body);

    const token = jwt.sign(loggedUser, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    response
      .cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true, // The Cookie can only be accessed on the server
        secure: process.env.NODE_ENV === 'production', // Use `https` on production
        sameSite: 'strict', // Can only be acceded in the same domain
        maxAge: 1000 * (60 * 2), // Expires in 1h, like the JWT
      })
      .send(loggedUser);
  } catch (error) {
    response.status(401).send({ message: error.message });
  }
});

app.post('/register', async (request, response) => {
  try {
    const registeredUser = await UserRepository.create(request.body);
    response.send(registeredUser);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

app.get('/profile', (request, response) => {
  const { user } = request.session;

  if (!user) {
    return response
      .status(401)
      .send({ message: 'Access unauthorized: Invalid token' });
  }

  response.render('profile', user);
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

handleServerShutdown(server);
