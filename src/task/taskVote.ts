import fs from "fs";
import path from "path";
import Voter from "../models/Voter";
import { logger } from "../logger/logger";
import { GXClient } from "gxclient";
import { config } from "../config/config";
import abi from "../abis/GXCvote";
const deserializeCallData =
  require("gxbjs/dist/tx_serializer").deserializeCallData;
import { sequelize } from "../db";

const gxclient = new GXClient(
  config.gxc.key,
  config.gxc.account,
  config.gxc.network
);

const STATE_FILE = path.resolve("./output/gxc.json");
const INITIAL_BLOCK = config.gxc.initial_block;
let latestBlock = INITIAL_BLOCK;
let currentBlock = INITIAL_BLOCK;

let _detectTransactionTimeout: any = null;

const _detectTransaction = async (blockHeight: any, callback: any) => {
  clearTimeout(_detectTransactionTimeout);
  try {
    logger.log(`New GXC block:${blockHeight},/${latestBlock}`);
    let block = await gxclient.getBlock(blockHeight);
    if (block) {
      let i = 0;
      for (let tx of block.transactions) {
        const txid = block.transaction_ids[i++];
        await callback(txid, tx);
      }
      currentBlock = blockHeight;
      if (currentBlock < latestBlock) {
        process.nextTick(() => {
          _detectTransaction(blockHeight + 1, callback);
        }, 1000);
      } else {
        _detectTransactionTimeout = setTimeout(() => {
          _detectTransaction(blockHeight + 1, callback);
        }, 1000);
      }
    } else {
      _detectTransactionTimeout = setTimeout(() => {
        _detectTransaction(blockHeight, callback);
      }, 1000);
    }
  } catch (ex) {
    logger.error("Error: Processing block", ex);
    _detectTransactionTimeout = setTimeout(() => {
      _detectTransaction(blockHeight, callback);
    }, 1000);
  }
};

let _taskSyncingLatestedBlockTimeout: any = null;
const _taskSyncingLatestedBlock = async () => {
  clearTimeout(_taskSyncingLatestedBlockTimeout);
  try {
    let dgp = await gxclient.getDynamicGlobalProperties();
    if (latestBlock != dgp.last_irreversible_block_num) {
      latestBlock = dgp.last_irreversible_block_num;
    }
  } catch (ex) {
    logger.error("Error: Fetching dgp", ex);
  } finally {
    _taskSyncingLatestedBlockTimeout = setTimeout(() => {
      _taskSyncingLatestedBlock();
    }, 3000);
  }
};

const readState = () => {
  try {
    let state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8") || "{}");
    currentBlock = state.currentBlock || INITIAL_BLOCK;
  } catch (ex: any) {
    console.error("Error reading gxc.json", ex.message);
    currentBlock = 0;
  }
};

const dealWithVote = async (txid: any, op: any) => {
  await sequelize.authenticate();
  await sequelize.sync();
  const transaction = await sequelize.transaction();
  try {
    // void vote(bool approve)
    let params = deserializeCallData("vote", op[1].data, abi);
    logger.info("Vote received", params);
    let Account = await gxclient.getObject(op[1].account);
    // let gxcBalanceObject = (
    //   await gxclient.getAccountBalances(Account.name)
    // ).find((item) => item.asset_id == "1.3.1");
    // let voteGXCNumber = gxcBalanceObject ? Number(gxcBalanceObject.amount) : 0;
    // const stakings = await gxclient._query("get_staking_objects", [Account.id]);
    // stakings.forEach((element: any) => {
    //   voteGXCNumber = voteGXCNumber + Number(element.amount.amount);
    // });
    let record = await Voter.findByPk(Account.name);
    if (record === null) {
      await Voter.create(
        {
          userName: Account.name,
          userId: Account.id,
          votingstate: params.approve,
          lastchangeTxid: txid,
          changeTimes: 0,
          voteGXCNumber: 0n,
        },
        { transaction }
      );
    } else {
      if (record.votingstate !== params.approve) {
        record.votingstate = params.approve;
        record.lastchangeTxid = txid;
        record.changeTimes++;
        await record.save({ transaction });
      } else {
        logger.warn(
          `The user : ${Account.name} dont change his vote state:${params.approve}`
        );
      }
    }
    await transaction.commit();
    console.log(await Voter.count());
  } catch (ex) {
    logger.error("Error: Dealing with init vote", ex);
    await transaction.rollback();
  }
};

const _startAfterSync = async (callback: any) => {
  try {
    let dgp = await gxclient.getDynamicGlobalProperties();
    let timeLegacy =
      new Date().getTime() - new Date(dgp.time + "Z").getTime() > 100 * 1000;
    if (timeLegacy) {
      logger.log("GXChain blocks syncing, legacy=", timeLegacy);
      setTimeout(() => {
        _startAfterSync(callback);
      }, 3000);
    } else {
      callback();
    }
  } catch (ex) {
    logger.error("Error fetching gxchain dgp", ex);
    setTimeout(() => {
      _startAfterSync(callback);
    }, 3000);
  }
};

// const sleep = async (time: number) => {
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, time);
//   });
// };

export const start = async () => {
  readState();
  _startAfterSync(() => {
    _taskSyncingLatestedBlock();
    _detectTransaction(currentBlock, async (txid: any, tx: any) => {
      for (const op of tx.operations) {
        if (op[0] == 75 && op[1].contract_id == config.gxc.contract.id) {
          if (op[1].method_name === "vote") {
            await dealWithVote(txid, op);
          }
        }
      }
    });
  });
};

export const saveState = () => {
  clearTimeout(_taskSyncingLatestedBlockTimeout);
  clearTimeout(_detectTransactionTimeout);
  let dataTosave = {
    timestamp: new Date().getTime(),
    currentBlock,
  };
  let fileCount = JSON.stringify(dataTosave, null, "");
  logger.debug("Saving gxc,json", fileCount);
  try {
    fs.writeFileSync(STATE_FILE, fileCount);
  } catch (ex) {
    logger.error("Error: Saving gxc.json", ex);
  }
};
