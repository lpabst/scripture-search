import express, { Request, Response, NextFunction } from 'express';

const authController = express.Router();

authController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // login here
    // send back jwt token
    return res.sendStatus(204);
  } catch(e) {
    next(e);
  }
})

export default authController;