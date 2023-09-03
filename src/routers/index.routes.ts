import {Router} from 'express';

import userRoutes from './user.routes';
import personRoutes from './person.routes';
import authRoutes from './auth.routes';

const router = Router();
export default (): Router => {
  /**
   * 
   */
  authRoutes(router);
  userRoutes(router);
  personRoutes(router);
  return router;
};