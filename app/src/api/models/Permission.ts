import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import Role from './Role';
import RolePermission from './RolePermission';

@Table({ tableName: 'permissions' })
class Permission extends Model<Permission> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles!: Role[];

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

export default Permission;
