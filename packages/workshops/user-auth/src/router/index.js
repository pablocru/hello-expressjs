import { isAuthenticated } from '../middleware/auth.js';

/**
 * @param {import("express").Application} app
 */
export function createRouter(app) {
  app.get('/', (request, response) => {
    const { user } = request.session;

    response.render('index', user);
  });

  app.get('/profile', isAuthenticated, (request, response) => {
    const { user } = request.session;

    response.render('profile', user);
  });
}
