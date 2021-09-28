import fs from "fs";
import path from "path";
import Voter from "../models/Voter";
import Statistics from "../models/statistics";
import Snapshot from "../models/Snapshot";
import { logger } from "../logger/logger";
import { sequelize } from "../db";

const datapath = path.join(__dirname, "../../data.json");
const bufferSplit = Buffer.from("\n");
const inputer = fs.createReadStream(datapath, { autoClose: true });
let dataBuffer = Buffer.from("");

let TotalVoteGxcNumber = 0n;
const findLimit = 1;

async function checkCount() {
  await Snapshot.drop();
  await Statistics.drop();
  inputer.on("data", async (chunk: Buffer) => {
    await dealData(chunk);
  });
  inputer.on("end", async () => {
    await statisticsForAccount();
    await statisticsForTotal();
  });
}

async function dealData(data: Buffer) {
  inputer.pause();
  dataBuffer = Buffer.concat([dataBuffer, data]);
  let index = dataBuffer.indexOf(bufferSplit);
  let lineBuffer: Buffer;
  let len: number;
  await sequelize.sync();
  while (index > -1) {
    len = index + bufferSplit.length;
    lineBuffer = dataBuffer.slice(0, len);
    const object = JSON.parse(lineBuffer.toString());
    const strings = object.id.split(".");
    if (strings[0] == "2" && strings[1] == "5") {
      if (object.asset_type == "1.3.1") {
        await Snapshot.create({
          objectID: object.id,
          owner: object.owner,
          amount: BigInt(object.balance),
        });
      }
    }
    if (strings[0] == "1" && strings[1] == "27") {
      await Snapshot.create({
        objectID: object.id,
        owner: object.owner,
        amount: BigInt(object.amount.amount),
      });
    }
    dataBuffer = dataBuffer.slice(len, dataBuffer.length);
    index = dataBuffer.indexOf(bufferSplit);
  }
  inputer.resume();
}

async function statisticsForAccount() {
  await sequelize.sync();
  const countnumber = await Voter.count();
  const transaction = await sequelize.transaction();
  let i = 0;
  try {
    while (i < countnumber) {
      const voter_objects = await Voter.findAll({
        offset: i,
        limit: findLimit,
        transaction,
      });
      voter_objects.forEach(async (voter_object) => {
        if (voter_object !== null) {
          const voter_id = voter_object.userId;
          const recordObject = await Snapshot.findAll({
            where: {
              owner: voter_id,
            },
          });
          let accountVoteGXC = 0n;
          recordObject.forEach((object) => {
            accountVoteGXC += BigInt(object.amount);
            TotalVoteGxcNumber += BigInt(object.amount);
          });
          voter_object.voteGXCNumber = accountVoteGXC;
          await voter_object.save({});
        }
      });
      i += findLimit;
    }
    await transaction.commit();
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
  }
}

async function statisticsForTotal() {
  await sequelize.sync();
  const countnumber = await Voter.count();
  let i = 0;
  const transaction = await sequelize.transaction();
  const statistic = await Statistics.create(
    {
      voteUserNumber: countnumber,
      totalVoteGXCNumber: 0n,
      voteUserNumberTrue: 0,
      voteUserNumberFalse: 0,
      totalVoteGXCNumberTrue: 0n,
      totalVoteGXCNumberFalse: 0n,
    },
    { transaction }
  );

  try {
    while (i < countnumber) {
      const voter_objects = await Voter.findAll({
        offset: i,
        limit: findLimit,
        transaction,
      });
      voter_objects.forEach((voter_object) => {
        if (voter_object !== null) {
          if (voter_object.votingstate === true) {
            console.log("true");
            statistic.voteUserNumberTrue++;
            let middleAmount =
              BigInt(statistic.totalVoteGXCNumberTrue) +
              BigInt(voter_object.voteGXCNumber);
            statistic.totalVoteGXCNumberTrue = middleAmount;
          } else {
            console.log("false");
            statistic.voteUserNumberFalse++;
            let middleAmount =
              BigInt(statistic.totalVoteGXCNumberFalse) +
              BigInt(voter_object.voteGXCNumber);
            statistic.totalVoteGXCNumberFalse = middleAmount;
          }
        }
      });

      i += findLimit;
    }
    statistic.totalVoteGXCNumber = TotalVoteGxcNumber;

    await statistic.save({ transaction });
    await transaction.commit();
  } catch (err) {
    logger.error(err);
    await transaction.rollback();
  }
}

checkCount();
