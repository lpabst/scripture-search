import express, { Request, Response, NextFunction } from 'express';

const userController = express.Router();

userController.post('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await req.ctx!.services.user.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    })
    return res.sendStatus(204);
  } catch(e) {
    next(e);
  }
})

userController.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await req.ctx?.services.user.getUserById(req.userId!);
    return res.status(200).send(user);
  } catch(e) {
    next(e);
  }
})

export default userController;