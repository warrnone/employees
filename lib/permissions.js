export function hasPermission(user, permissionCode) {
  if (!user) return false;

  // Super Admin เห็นทุกอย่าง
  // if (
  //   user.role === "SUPER_ADMIN" ||
  //   user.role_code === "SUPER_ADMIN"
  // ) {
  //   return true;
  // }

  return Array.isArray(user.permissions)
    ? user.permissions.includes(permissionCode)
    : false;
}