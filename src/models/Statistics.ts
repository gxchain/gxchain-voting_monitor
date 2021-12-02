import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
export class Statistics extends Model {}

export declare interface c {
  voteUserNumber: number;
  totalVoteGXCNumber: bigint;
  voteUserNumberTrue: number;
  voteUserNumberFalse: number;
  totalVoteGXCNumberTrue: bigint;
  totalVoteGXCNumberFalse: bigint;
}
Statistics.init(
  {
    voteUserNumber: {
      type: DataTypes.INTEGER,
      comment: "vote users number",
    },
    voteUserNumberTrue: {
      type: DataTypes.INTEGER,
    },
    voteUserNumberFalse: {
      type: DataTypes.INTEGER,
    },
    totalVoteGXCNumber: {
      type: DataTypes.BIGINT,
      comment: "total vote GXC number",
    },
    totalVoteGXCNumberTrue: {
      type: DataTypes.BIGINT,
    },
    totalVoteGXCNumberFalse: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["voteUserNumber", "totalVoteGXCNumber"],
      },
    ],
    tableName: "voting_statistic",
  }
);

export default Statistics;
