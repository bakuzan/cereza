import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export default class Pinned extends Model<Pinned> {
  @Column({ type: DataTypes.STRING, allowNull: false, unique: true })
  public path!: string;
}
