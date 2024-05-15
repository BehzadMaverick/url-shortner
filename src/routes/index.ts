import { Router } from 'express';
import urlRoutes from './urlRoutes'
const router = Router();

router.use('/', urlRoutes)

export default router;
