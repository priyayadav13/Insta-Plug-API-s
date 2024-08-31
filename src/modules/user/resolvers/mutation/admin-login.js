const { includes } = require('lodash');

const { ADMIN_ROLES } = require('../../../../constants/service-constants');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateHash = require('../../../../utils/auth/generate-password');
const generateRefreshToken = require('../../../../utils/auth/generate-refresh-token');
const generateAccessToken = require('../../../../utils/auth/generate-token');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

// eslint-disable-next-line import/order
const { Op } = require('sequelize');

const adminLogin = async (parent, args, context) => {
  try {
    const { email, password } = args.input;
    const { models: { User: userModel, accessToken: accessTokenModel }, localeService } = context;
    const user = await userModel.findOne({
      where: { email: { [Op.iLike]: `%${email}%` } },
    });
    if (!user) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService), 'USER_NOT_FOUND');
    }
    if (!includes(ADMIN_ROLES, user.roles)) {
      throw new CustomGraphqlError(getMessage('UNAUTHORIZED', localeService), 'UNAUTHORIZED');
    }
    const encryptedPassword = generateHash(password);

    if (user.password !== encryptedPassword) {
      throw new CustomGraphqlError(getMessage('INVALID_CREDENTIALS', localeService), 'INVALID_CREDENTIALS');
    }
    const accessToken = await generateAccessToken(user.id);
    if (!user.refreshToken) {
      const refreshToken = await generateRefreshToken(user.id);
      user.refreshToken = refreshToken;
      await user.save();
    }

    await accessTokenModel.create({
      userId: user.id,
      accessToken,
    });

    return {
      accessToken,
      refreshToken: user.refreshToken,
      message: 'Login Successfully',
    };
  } catch (error) {
    userLogger.error(`error from adminLogin resolver => ${error}`, context);
    throw error;
  }
};

module.exports = adminLogin;
