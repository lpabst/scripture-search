import express from "express";
import searchController from "./controllers/searchController";

const router = express.Router();

router.get("/health", (req, res, next) => {
  return res.status(200).send("ok");
});

router.use(searchController);

export default router;
