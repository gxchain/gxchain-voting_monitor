import express from "express";
import { Voter } from "../models/Voter";
import { Statistics } from "../models/Statistics";

const router = express.Router();

router.get("/voter", async (req, res) => {
  try {
    let result = await Voter.findAll();
    let resultTrue = await Voter.findAll({ where: { votingstate: true } });
    let resultFalse = await Voter.findAll({ where: { votingstate: false } });
    res.send({ result, resultTrue, resultFalse });
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

module.exports = router;
