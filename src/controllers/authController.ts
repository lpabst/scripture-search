import express, { Request, Response, NextFunction } from "express";
import { celebrate, Joi } from "celebrate";
import validateEmailFormatInBody from "../middleware/validateEmailFormatInBody";

const authController = express.Router();

authController.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  validateEmailFormatInBody,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const debug = true;
      if (debug) {
        return res.status(367).send("hi there! 10");
      }

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
