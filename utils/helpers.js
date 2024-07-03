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

module.exports = {
  generateHash,
  saveFileToDisk,
};
