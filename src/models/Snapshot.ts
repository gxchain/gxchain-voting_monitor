import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
export class Snapshot extends Model {}

export declare interface Snapshot {
  objectID: string;
  owner: string;
  amount: bigint;
}

Snapshot.init(
  {
    objectID: {
      type: DataTypes.STRING,
      // primaryKey: true,
      comment: "object id",
    },
    owner: {
      type: DataTypes.STRING,
      comment: "the owner of object",
    },
    amount: {
      type: DataTypes.BIGINT,
      comment: "the amount of object",
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["objectID", "owner", "amount"],
      },
    ],
    tableName: "voting_snapshot",
  }
);

export default Snapshot;
