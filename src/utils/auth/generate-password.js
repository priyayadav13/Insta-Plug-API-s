const crypto = require('crypto');

const defaultLogger = require('../../logger');

const generatePassword = passwordString => {
  try {
    // CREATING A UNIQUE SALT FOR A PARTICULAR USER
    const salt = crypto.randomBytes(16).toString('hex');
    // TODO: CREATE VERIFY PASSWORD FUNCTION BASED ON REQUIREMENT, TO STORE SALT IN DATABASE OR NOT
    // HASHING USER'S SALT AND PASSWORD WITH 1000 ITERATIONS
    const hash = crypto.pbkdf2Sync(passwordString, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
  } catch (error) {
    defaultLogger(`Error from generatePassword => ${error}`, {}, 'error');
    throw error;
  }
};

module.exports = generatePassword;
