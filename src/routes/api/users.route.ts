import { Router } from 'express';
import * as controller from '../../controllers/users.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const routes = Router();

routes
  .route('/')
  .post(controller.create)
  .get(authMiddleware, controller.getMany);
routes
  .route('/:id')
  .get(authMiddleware, controller.getOne)
  .patch(authMiddleware, controller.update)
  .delete(authMiddleware, controller.deleteUser);

// authenticate routes
routes.route('/auth').post(controller.authenticate);

export default routes;
