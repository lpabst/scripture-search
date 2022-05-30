import express, { Request, Response, NextFunction } from "express";
import { celebrate, Joi } from "celebrate";

const authController = express.Router();

authController.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtTokens = await req.ctx?.services.auth.login({
        email: req.body.email,
        password: req.body.password,
      });
      return res.status(200).send(jwtTokens);
    } catch (e) {
      next(e);
    }
  }
);

export default authController;
