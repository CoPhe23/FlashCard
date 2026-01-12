const LS_ADMIN = "flash_admin";
const ACCESS_KEY = "osztv";

export function isAdmin() {
  return localStorage.getItem(LS_ADMIN) === "true";
}

export function setAdmin(value) {
  localStorage.setItem(LS_ADMIN, value ? "true" : "false");
}

export function checkKey(key) {
  return key.trim() === ACCESS_KEY;
}
