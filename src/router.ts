import express from "express";
import userController from './controllers/userController';

const router = express.Router();

router.get('/health', (req, res, next) => {
  return res.status(200).send('ok');
})

router.use(userController);

export default router;