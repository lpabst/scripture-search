import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";
import validateAccessToken from "../middleware/validateAccessToken";
import { getProductUpdatesFromRequestBody } from "../utils/patchUpdates";

const productController = express.Router();

productController.post(
  "/product",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      weightOunces: Joi.number().required(),
    }),
  }),
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await req.ctx.services.product.createProduct({
        userId: req.userId!,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        weightOunces: req.body.weightOunces,
      });
      return res.status(200).send({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        weightOunces: product.weightOunces,
        createdAt: product.createdAt,
      });
    } catch (e) {
      next(e);
    }
  }
);

productController.patch(
  "/product/:productId",
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      weightOunces: Joi.number(),
    }),
  }),
  validateAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productUpdates = getProductUpdatesFromRequestBody(req.body);
      await req.ctx.services.product.updateProductById(
        req.params.productId,
        productUpdates
      );
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

export default productController;
