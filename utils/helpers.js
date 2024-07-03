import sha1 from 'sha1';
import fs from 'fs';

const generateHash = (password) => sha1(password);

const saveFileToDisk = (path, data) => {
  try {
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(path, buffer);
    return true;
  } catch (err) {
    console.error('Error:', err);
    return false;
  }
};

const getFileData = (path) => {
  try {
    const data = fs.readFileSync(path);
    if (!data) {
      console.log('File not found');
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateHash,
  saveFileToDisk,
  getFileData,
};
