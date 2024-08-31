/* eslint-disable consistent-return */
const businessProfileDataService = require('../../services/business-profile-data');

const sourceLogger = require('../../source-logger');

const businessProfileData = async (parents, args, context) => {
  try {
    const { data = {} } = args;
    const { accessToken } = data;
    const response = await businessProfileDataService(accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from businessProfileData resolver ${error}`, context);
    throw error;
  }
};
module.exports = businessProfileData;
