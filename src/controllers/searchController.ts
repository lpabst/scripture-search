import { celebrate, Joi } from "celebrate";
import express, { Request, Response, NextFunction } from "express";
import { getEsPaginationParamsFromReqQuery } from "../utils/helpers";

const searchController = express.Router();

searchController.get(
  "/search",
  celebrate({
    query: Joi.object().keys({
      q: Joi.string().required(),
      limit: Joi.string(),
      offset: Joi.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchQuery = req.query.q as string;
      const paginationParams = getEsPaginationParamsFromReqQuery(req.query);
      const products = await req.ctx.services.search.searchScriptures(
        searchQuery,
        paginationParams
      );
      return res.status(200).send({
        limit: paginationParams.limit,
        offset: paginationParams.offset,
        data: products,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default searchController;
