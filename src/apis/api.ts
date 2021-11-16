import express from "express";
import { Voter } from "../models/Voter";
import { Statistics } from "../models/Statistics";
import { gxclient } from "../task/taskVote";
import { config } from "../config/config";

const router = express.Router();

router.get("/findone", async (req, res) => {
  try {
    const name = req.query.name;
    let result = await Voter.findOne({ where: { userName: name } });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.get("/voter", async (req, res) => {
  try {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const resultsSum = await Voter.count();
    let result = await Voter.findAll({ offset: offset, limit: limit });
    res.send({ result, resultsSum });
  } catch (err) {
    throw err;
  }
});

router.get("/voter_sum", async (req, res) => {
  try {
    const voterNum = await Voter.count();
    const voterTrueNum = await Voter.count({ where: { votingstate: true } });
    const voterFalseNum = await Voter.count({ where: { votingstate: false } });
    const voterGXCSum = await Voter.sum("voteGXCNumberHourly");
    const voterGXCTrueSum = await Voter.sum("voteGXCNumberHourly", {
      where: { votingstate: true },
    });
    const voterGXCFalseSum = await Voter.sum("voteGXCNumberHourly", {
      where: { votingstate: false },
    });
    res.send({
      voterNum,
      voterTrueNum,
      voterFalseNum,
      voterGXCSum,
      voterGXCTrueSum,
      voterGXCFalseSum,
    });
  } catch (err) {
    throw err;
  }
});

router.get("/statistics", async (req, res) => {
  try {
    let statistics = await Statistics.findOne();
    res.send({ statistics });
  } catch (err) {
    throw err;
  }
});

router.get("/state", async (req, res) => {
  try {
    const dgp = await gxclient.getDynamicGlobalProperties();
    if (dgp.head_block_number < config.gxc.endblock) {
      res.send({ canVote: true });
    } else {
      res.send({ canVote: false });
    }
  } catch (err) {
    throw err;
  }
});

router.get("/date", async (req, res) => {
  try {
    const startTime = new Date(
      (await gxclient.getBlock(config.gxc.startblock)).timestamp
    );
    const stopTime = new Date(
      startTime.getTime() + 3000 * (config.gxc.endblock - config.gxc.startblock)
    );
    res.send({ startTime: startTime, stopTime: stopTime });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
