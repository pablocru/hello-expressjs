import { fileURLToPath } from 'url';
import { handleServerShutdown } from '@hello-expressjs/server-shutdown-handler';
import { jwtSessionManager } from './middleware/auth.js';
import { PORT } from '@hello-expressjs/environment-config';
import auth from './api/index.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import router from './router/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init App
const app = express();

// Specify template engine that is EJS (Embedded JavaScript Templates)
// -> https://ejs.co/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
// -> to process JSON
app.use(express.json());

// -> to manage Cookies
app.use(cookieParser());

// -> to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// -> to process the JWT & Session
app.use(jwtSessionManager);

// Routes
// -> Application UI
app.use('/', router);

// -> Auth API REST
app.use('/auth', auth);

// Start App
const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

// Stop App
handleServerShutdown(server);
