import { Router, Request, Response } from 'express';
import * as controller from '../../controllers/users.controller';

const routes = Router();

routes.route('/').post(controller.create).get(controller.getMany);
routes
  .route('/:id')
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.deleteUser);

// authenticate routes
routes.route('/auth').post(controller.authenticate);

export default routes;
