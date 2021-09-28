import * as taskVote from "./task/taskVote";
import { logger } from "./logger/logger";
import fs from "fs";
import * as api from "./apis";

const dir = "./output";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let taskName = (
  process.argv.slice(2).length > 0 ? process.argv.slice(2)[0] : ""
).toLowerCase();

startTask();

function startTask() {
  logger.info("Trying to start", taskName);
  taskVote.start();
  api.start();
  startProcessListener();
}

function startProcessListener() {
  process.stdin.resume();
  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  //catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

function exitHandler(options: any, exitCode: any) {
  if (options.cleanup) {
    stopTask();
  }
  if (exitCode || exitCode === 0) {
    logger.warn("exit with code: ", exitCode);
  }
  if (options.exit) {
    logger.warn("exiting...");
    process.exit();
  }
}

function stopTask() {
  logger.info("Saving relay status", taskName);
  taskVote.saveState();
}
