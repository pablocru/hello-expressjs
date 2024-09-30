import {
  AUTH_FORM_ERROR_COOKIE_NAME,
  JWT_COOKIE_NAME,
  JWT_SECRET_KEY,
} from '../config.js';
import { createCookieOptions } from '../utils/create-cookie-options.js';
import { Router, urlencoded } from 'express';
import { UserRepository } from '../dao/user-repository.js';
import jwt from 'jsonwebtoken';

const auth = Router();

// Middleware to process `application/x-www-form-urlencoded` that is sended by a Form
auth.use(urlencoded({ extended: true }));

auth.post('/login', async (request, response) => {
  try {
    const loggedUser = await UserRepository.login(request.body);

    const token = jwt.sign(loggedUser, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    response
      .cookie(JWT_COOKIE_NAME, token, createCookieOptions())
      .redirect('/profile');
  } catch (error) {
    authError(request, response, 'login', error.message);
  }
});

auth.post('/register', async (request, response) => {
  try {
    await UserRepository.create(request.body);

    response.redirect('/');
  } catch (error) {
    authError(request, response, 'register', error.message);
  }
});

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {string} apiPath
 * @param {string} errorMessage
 */
function authError(request, response, apiPath, errorMessage) {
  response
    .cookie(
      AUTH_FORM_ERROR_COOKIE_NAME,
      {
        message: errorMessage,
        apiPath,
        ...request.body,
      },
      createCookieOptions({ maxAge: 60_000 })
    )
    .redirect('/');
}

auth.post('/logout', (_request, response) => {
  response.clearCookie(JWT_COOKIE_NAME).redirect('/');
});

export default auth;
