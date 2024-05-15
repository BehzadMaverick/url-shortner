import { Router } from 'express';
import UrlController from '../controllers/urlController';
import authMiddleware from '../middlewares/authMiddleware';
const router = Router();

router.post('/url', authMiddleware, new UrlController().generateShortUrl);

router.get('*', authMiddleware, new UrlController().getOriginalUrl);

export default router