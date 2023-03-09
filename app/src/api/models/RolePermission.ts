import {Table, Column, Model, DataType, HasMany, BelongsToMany, ForeignKey} from 'sequelize-typescript';
import Role from './Role';
import Permission from './Permission';

@Table({ tableName: 'role_permissions' })
class RolePermission extends Model<RolePermission> {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId!: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  permissionId!: number;

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

export default RolePermission;
