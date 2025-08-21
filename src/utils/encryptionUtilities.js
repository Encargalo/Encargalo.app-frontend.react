import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYTION_KEY;

export const encryptData = (data) => {
  const jsonData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
};

export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return null;
  }
};

export const setEncryptedItem = (key, data) => {
  const encrypted = encryptData(data);
  localStorage.setItem(key, encrypted);
};

export const getDecryptedItem = (key) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decryptData(encrypted);
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
