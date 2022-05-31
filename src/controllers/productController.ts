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
      tags: Joi.array().items(Joi.string()).max(10),
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
        tags: req.body.tags || [],
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

// get public info of specific product (requesting user doesn't need to be signed in to use this)
productController.get(
  "/product/:productId",
  celebrate({
    params: Joi.object().keys({
      productId: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await req.ctx.services.product.getProductByIdOrFail(
        req.params.productId
      );
      return res.status(200).send({
        id: product.id,
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        weightOunces: Joi.number(),
        // TODO: need to figure out images for product listings. Probably another table with 1-many relationship to a product, then grab all of those and send them back here. We'll also need endpoints to add images to a product listing, and somewhere to store those images
        imageUrls: [],
      });
    } catch (e) {
      next(e);
    }
  }
);

export default productController;
