import { JWT_COOKIE_NAME, JWT_SECRET_KEY } from '../config.js';
import { UserRepository } from '../dao/user-repository.js';
import jwt from 'jsonwebtoken';

/**
 * @param {import("express").Application} app
 */
export function createAPI(app) {
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

  app.post('/logout', (_request, response) => {
    response.clearCookie(JWT_COOKIE_NAME).redirect('/');
  });
}
