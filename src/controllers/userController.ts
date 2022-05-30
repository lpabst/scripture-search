import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";

const userController = express.Router();

userController.post(
  "/user",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await req.ctx!.services.user.createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

userController.get(
  "/user",
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await req.ctx?.services.user.getUserById(req.userId!);
      return res.status(200).send(user);
    } catch (e) {
      next(e);
    }
  }
);

userController.get(
  "/email/verify",
  celebrate({
    params: Joi.object().keys({
      authorization: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // verify email with token here
      // return res.status(200).send(user);
    } catch (e) {
      next(e);
    }
  }
);

export default userController;
