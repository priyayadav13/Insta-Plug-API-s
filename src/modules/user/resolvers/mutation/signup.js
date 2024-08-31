// const { getMessage } = require('../../../../utils/messages');

const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');
const { Op } = require('sequelize');

const userLogger = require('../../user-logger');

async function signUp(parent, args, context) {
  const { models } = context;
  const {
    email, password, username, roles, isDisable,
  } = args.details;
  try {
    const findUser = await models.User.findOne({ where: { email: { [Op.iLike]: `%${email}%` } } });
    if (findUser) {
      const error = new GraphQLError('user already exist');
      throw error;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      email,
      password: passwordHash,
      roles,
      isDisable,
    });
    return user;
  } catch (error) {
    userLogger.error(`Error from signup resolver => ${error}`);
    throw error;
  }
}

module.exports = signUp;

