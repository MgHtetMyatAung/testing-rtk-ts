import CryptoJS from "crypto-js";

// Secret key for encryption (this should be stored securely)
const SECRET_KEY = "cr7p3wm5eZVM/jN/eGuvmxscjWiS4KOZJZSNFEW969w=";

// Encrypt a token
export const encryptToken = (token: string) => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Decrypt a token
export const decryptToken = (encryptedToken: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
