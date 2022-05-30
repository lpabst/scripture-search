import express from "express";
import userController from './controllers/userController';
import authController from './controllers/authController';

const router = express.Router();

router.get('/health', (req, res, next) => {
  return res.status(200).send('ok');
})

router.use(userController);
router.use(authController);

export default router;