import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";
import validateAccessToken from "../middleware/validateAccessToken";

const userController = express.Router();
userController.use(validateAccessToken);

userController.post(
  "/shop",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await req.ctx!.services.shop.createShop({
        userId: req.userId!,
        name: req.body.name,
        description: req.body.description,
      });
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

userController.get(
  "/shop",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await req.ctx.services.shop.getShopByUserId(req.userId!);
      return res.status(200).send(shop);
    } catch (e) {
      next(e);
    }
  }
);

export default userController;
