const adminLogin = require('./mutation/admin-login');
const newAccessToken = require('./mutation/new-access-token');
const signup = require('./mutation/signup');
const userLogin = require('./mutation/user-login');

const sample = () => 'sample';

const resolvers = {
  Mutation: {
    signup,
    userLogin,
    adminLogin,
    newAccessToken,
  },
  Query: {
    sample,
  },
};

module.exports = resolvers;
