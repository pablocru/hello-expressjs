import { JWT_COOKIE_NAME, JWT_SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken';

/**
 * Process the JWT & Session
 * @param {import("express").Request} request
 * @param {import("express").Response} _response
 * @param {import("express").NextFunction} next
 */
export function jwtSessionManager(request, _response, next) {
  const token = request.cookies[JWT_COOKIE_NAME];

  request.session = { user: null };

  try {
    const data = jwt.verify(token, JWT_SECRET_KEY);

    request.session.user = data;
  } catch {}

  next(); // Go to the next route/middleware
}

/**
 * Protect those endpoints or routes that should be protected
 * @param {import("express").Request} request
 * @param {import("express").Response} _response
 * @param {import("express").NextFunction} next
 */
export function isAuthenticated(req, res, next) {
  const { user } = req.session;

  if (user) {
    next(); // Go to the next route/middleware
  } else {
    // Redirect to Login/Register page
    res.redirect('/');
  }
}
