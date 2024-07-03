import sha1 from 'sha1';

const generateHash = (password) => sha1(password);

module.exports = {
  generateHash,
};
