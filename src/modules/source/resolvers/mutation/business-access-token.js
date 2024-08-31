/* eslint-disable consistent-return */
const businessAccessTokenService = require('../../services/business-access-service');

const sourceLogger = require('../../source-logger');

const businessAccessToken = async (parent, args, context) => {
  try {
    const { data = {} } = args;
    const { accessToken } = data;
    const response = await businessAccessTokenService(accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from businessAccessToken resolver => ${error}`, context);
    throw error;
  }
};
module.exports = businessAccessToken;
