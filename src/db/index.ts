import { logger } from "../logger/logger";
import { config } from "../config/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(config.service.connection, {
  logging: (msg) => logger.log(msg),
});
