import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

interface ShortUrlAttributes {
  id?: number;
  originalUrl: string;
  shortUrl: string;
}

export class ShortUrl
  extends Model<ShortUrlAttributes>
  implements ShortUrlAttributes
{
  public id!: number;
  public originalUrl!: string;
  public shortUrl!: string;
}

ShortUrl.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    originalUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
  },
  {
    tableName: "urls",
    sequelize,
  }
);
