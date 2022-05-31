import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";
import validateAccessToken from "../middleware/validateAccessToken";
import { getShopUpdatesFromRequestBody } from "../utils/patchUpdates";

const shopController = express.Router();

shopController.post(
  "/shop",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
    }),
  }),
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await req.ctx!.services.shop.createShop({
        userId: req.userId!,
        name: req.body.name,
        description: req.body.description,
      });
      return res.status(200).send({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        createdAt: shop.createdAt,
      });
    } catch (e) {
      next(e);
    }
  }
);

// Get the signed in user's shop
shopController.get(
  "/shop",
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await req.ctx.services.shop.getShopByUserIdOrFail(
        req.userId!
      );
      return res.status(200).send({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        imageUrl: shop.imageUrl,
        websiteUrl: shop.websiteUrl,
        createdAt: shop.createdAt,
        ACHRoutingNumber: shop.ACHRoutingNumber,
        ACHAccountNumber: shop.ACHAccountNumber,
      });
    } catch (e) {
      next(e);
    }
  }
);

// get public details about a shop (the requesting user doesn't have to be signed in)
shopController.get(
  "/shop/:shopId",
  celebrate({
    params: Joi.object().keys({
      shopId: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shop = await req.ctx.services.shop.getShopByIdOrFail(
        req.params.shopId
      );
      return res.status(200).send({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        imageUrl: shop.imageUrl,
        websiteUrl: shop.websiteUrl,
        createdAt: shop.createdAt,
      });
    } catch (e) {
      next(e);
    }
  }
);

// update shop for signed in user
shopController.patch(
  "/shop",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      websiteUrl: Joi.string(),
      ACHRoutingNumber: Joi.string(),
      ACHAccountNumber: Joi.string(),
    }),
  }),
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopUpdates = getShopUpdatesFromRequestBody(req.body);
      await req.ctx.services.shop.updateShopByUserId(req.userId!, shopUpdates);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

export default shopController;
