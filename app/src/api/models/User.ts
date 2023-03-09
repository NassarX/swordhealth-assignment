import {Table, Column, Model, DataType, HasMany, BelongsTo} from 'sequelize-typescript';
import Task from './Task';
import Role from "./Role";

@Table({ tableName: 'users' })
class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId!: number;

  @BelongsTo(() => Role, 'roleId')
  role!: Role;

  @HasMany(() => Task, 'userId')
  tasks!: Task[];

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
}

export default User;
