import Role from '../../api/models/Role';
import Permission from '../../api/models/Permission';
import RolePermission from '../../api/models/RolePermission';


export default async function seedDatabase() {
  // Seed roles
  const rolesData = [
    { id: 1, name: 'manager' },
    { id: 2, name: 'technician' },
  ];
  // @ts-ignore
  const roles = await Role.bulkCreate(rolesData, {
    // Set `ignoreDuplicates` to `true` to ignore any duplicates (based on `id` field)
    ignoreDuplicates: true,
  });

  // Seed permissions
  const permissionsData = [
    { name: 'create_task' },
    { name: 'view_tasks' },
    { name: 'view_task' },
    { name: 'update_task' },
    { name: 'delete_task' },
    { name: 'view_user_tasks' },
  ];
  // @ts-ignore
  const permissions = await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });

  // Seed role permissions
  const rolePermissionsData = [
    { roleId: roles[0].id, permissionId: permissions[1].id },
    { roleId: roles[0].id, permissionId: permissions[4].id },
    { roleId: roles[0].id, permissionId: permissions[5].id },
    { roleId: roles[1].id, permissionId: permissions[0].id },
    { roleId: roles[1].id, permissionId: permissions[2].id },
    { roleId: roles[1].id, permissionId: permissions[3].id },
  ];
  // @ts-ignore
  await RolePermission.bulkCreate(rolePermissionsData, { ignoreDuplicates: true });
}
