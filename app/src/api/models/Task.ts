import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from "./User";

@Table({
  timestamps: true,
  tableName: 'tasks',
  paranoid: true //imposes a soft delete on the model
})
class Task extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(250),
    allowNull: false
  })
  title!: string;

  @Column({
    type: DataType.STRING(2500),
    allowNull: false
  })
  summary!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: null
  })
  performedAt!: Date;

  @ForeignKey(() => User)
  @Column({
    allowNull: false
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt?: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    onUpdate: 'NOW()'
  })
  updatedAt?: Date;

  @Column({
    type: DataType.DATE
  })
  deletedAt?: Date;
}
export default Task;
