let currentAdminId = '';

export function setCurrentAdminId(adminId: string) {
  currentAdminId = adminId.trim();
}

export function getCurrentAdminId() {
  return currentAdminId;
}