/* eslint-disable no-unused-vars */

const businessMediaDataService = require('../../services/business-media-data');
const businessProfileDataService = require('../../services/business-profile-data');

const sourceLogger = require('../../source-logger');

const businessMediaData = async (parent, args, context) => {
  try {
    // const { req: { } } = context;
    const { data = {} } = args;
    const { accessToken } = data;
    const instaUser = await businessProfileDataService(accessToken, context);
    const instaUserId = instaUser.id;
    const response = await businessMediaDataService(instaUserId, accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from businessMediaData resolver => ${error}`, context);
    throw error;
  }
};
module.exports = businessMediaData;
