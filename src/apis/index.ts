import express from "express";
import { logger } from "../logger/logger";

export const start = () => {
  const app = express();
  const port = parseInt(process.env.port || "3031");
  const localhost = process.env.LOCALHOST || "0.0.0.0";

  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  app.use("/api", require("./api"));

  app.listen(port, localhost, () => {
    logger.log("Api server has started");
  });
};
