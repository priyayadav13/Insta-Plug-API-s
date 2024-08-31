const createUser = require('./create-user');

const bootFiles = async () => {
  await createUser();
};

module.exports = bootFiles;
