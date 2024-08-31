/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
const admin = require('firebase-admin');

const { Op } = require('sequelize');

// const CONFIG = require('../../../../config/config');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateRefreshToken = require('../../../../utils/auth/generate-refresh-token');
const generateAccessToken = require('../../../../utils/auth/generate-token');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

// const firebaseCredentials = require(`../../../../config/${CONFIG.FIREBASE.CONFIG_FILE}`);

admin.initializeApp({
  // credential: admin.credential.cert(firebaseCredentials),
});

const userLogin = async (parent, args, context) => {
  try {
    const { input } = args;
    const { email } = input;
    // const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    const {
      models: {
        User: UserModel, AccessToken: accessTokenModel, Widgets: WidgetsModel, ServiceAuthToken: ServiceAuthTokenModel,
      }, localService,
    } = context;
    const user = await UserModel.findOne({
      where: { email: { [Op.iLike]: `%${email}%` } },
      include: [{
        model: WidgetsModel,
        as: 'widgets',
        attributes: ['id', 'name'],
      },
      {
        model: ServiceAuthTokenModel,
        as: 'ServiceAuthToken',
        attributes: ['id', 'service'],
      },
      ],
    });
    if (!user) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localService), 'USER_NOT_FOUND');
    }
    if (user.roles !== 'USER') {
      throw new CustomGraphqlError(getMessage('UNAUTHORIZED', localService), 'UNAUTHORIZED');
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
      message: getMessage('LOGIN_SUCCESSFULLY', localService),
      user,
    };
  } catch (error) {
    userLogger.error(`error from userLogin resolver => ${error}`, context);
    throw error;
  }
};

module.exports = userLogin;
