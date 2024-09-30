import { isAuthenticated } from '../middleware/auth.js';
import { Router } from 'express';

const router = Router();

router.get('/', (request, response) => {
  const { user } = request.session;

  response.render('index', user);
});

router.get('/profile', isAuthenticated, (request, response) => {
  const { user } = request.session;

  response.render('profile', user);
});

export default router;
