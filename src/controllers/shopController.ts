import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";
import validateAccessToken from "../middleware/validateAccessToken";
import { getPaginationParamsFromReqQuery } from "../utils/helpers";
import { getShopUpdatesFromRequestBody } from "../utils/patchUpdates";
import { ProductOrderByColumns } from "../types/enums/ProductOrderByColumns";
import { OrderDir } from "../types/enums/OrderDir";

const shopController = express.Router();

const productPaginationParamsValidation = {
  query: Joi.object().keys({
    limit: Joi.string(),
    offset: Joi.string(),
    orderBy: Joi.string()
      .required()
      .valid(ProductOrderByColumns.createdAt)
      .valid(ProductOrderByColumns.price),
    orderDir: Joi.string().required().valid(OrderDir.DESC).valid(OrderDir.ASC),
  }),
};

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

// get list of detailed info for all products for the signed in user's shop
shopController.get(
  "/shop/list/products",
  celebrate({
    ...productPaginationParamsValidation,
  }),
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryPaginationParams = getPaginationParamsFromReqQuery(req.query);
      const productsForShop =
        await req.ctx.services.user.queryProductsForUsersShop(
          req.userId!,
          queryPaginationParams
        );
      return res.status(200).send({
        limit: queryPaginationParams.limit,
        offset: queryPaginationParams.offset,
        data: productsForShop,
      });
    } catch (e) {
      next(e);
    }
  }
);

// get list of public info for all products for a specific shop (requesting user doesn't need to be signed in)
shopController.get(
  "/shop/:shopId/products",
  celebrate({
    ...productPaginationParamsValidation,
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryPaginationParams = getPaginationParamsFromReqQuery(req.query);
      const productsForShop =
        await req.ctx.services.shop.queryProductsPublicInfoForShop(
          req.params.shopId,
          queryPaginationParams
        );
      return res.status(200).send({
        limit: queryPaginationParams.limit,
        offset: queryPaginationParams.offset,
        data: productsForShop,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default shopController;
