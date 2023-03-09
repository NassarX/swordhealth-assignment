import {Table, Column, Model, DataType, HasMany, BelongsToMany} from 'sequelize-typescript';
import User from './User';
import Permission from './Permission';
import RolePermission from './RolePermission';
import {BelongsToManyGetAssociationsMixin} from "sequelize";

@Table({ tableName: 'roles' })
class Role extends Model<Role> {
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

  @HasMany(() => User, 'roleId')
  users!: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Permission[];

  public getPermissions!: BelongsToManyGetAssociationsMixin<Permission>;
  public static associate() {
    this.belongsToMany(Permission, { through: RolePermission, as: 'permissions' });
  }

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

export default Role;
