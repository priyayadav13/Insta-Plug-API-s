const longLivedAccessToken = require('../../services/long-lived-access-token');

const sourceLogger = require('../../source-logger');

const getLongLivedAccessToken = async (parent, args, context) => {
  try {
    // const { req: { } } = context;
    const { data = {} } = args;
    const { accessToken } = data;
    const response = await longLivedAccessToken(accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from getLongLivedAccessToken resolver => ${error}`, context);
    throw error;
  }
};
module.exports = getLongLivedAccessToken;
