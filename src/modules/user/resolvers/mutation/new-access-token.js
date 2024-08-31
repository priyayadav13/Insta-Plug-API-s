const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const decodedRefreshToken = require('../../../../utils/auth/decode-refresh-token');
const generateAccessToken = require('../../../../utils/auth/generate-token');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const newAccessToken = async (parent, { refreshToken }, context) => {
  try {
    const { models: { User: userModel, AccessToken: accessTokenModel }, localeService } = context;
    const user = await userModel.findOne({
      where: { refreshToken },
    });

    if (!user) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService), 'USER_NOT_FOUND');
    }

    const payload = await decodedRefreshToken(refreshToken);
    const accessToken = await generateAccessToken(payload.userId);
    // console.log('=====================', payload);
    await accessTokenModel.create({
      userId: payload.userId,
      accessToken,
    });

    // console.log(accessToken);
    return accessToken;
  } catch (error) {
    userLogger.error(`Error from newAccessToken resolver=> ${error}`, context);
    throw error;
  }
};

module.exports = newAccessToken;

