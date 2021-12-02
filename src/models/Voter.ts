import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
export class Voter extends Model {}

export declare interface Voter {
  userName: string;
  userId: string;
  votingstate: boolean;
  lastchangeTxid: string;
  changeTimes: number;
  voteGXCNumber: bigint;
  voteGXCNumberHourly: bigint;
}

Voter.init(
  {
    userName: {
      type: DataTypes.STRING,
      primaryKey: true,
      comment: "user name of GXChain",
    },
    userId: {
      type: DataTypes.STRING,
      comment: "user id of GXChain",
    },
    votingstate: {
      type: DataTypes.BOOLEAN,
      comment: "vote state",
    },
    lastchangeTxid: {
      type: DataTypes.STRING,
    },
    changeTimes: {
      type: DataTypes.INTEGER,
    },
    voteGXCNumber: {
      type: DataTypes.BIGINT,
    },
    voteGXCNumberHourly: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    engine: "MyISAM",
    indexes: [
      {
        unique: true,
        fields: ["userId", "userName"],
      },
    ],
    tableName: "voting_monitor",
  }
);

export default Voter;
