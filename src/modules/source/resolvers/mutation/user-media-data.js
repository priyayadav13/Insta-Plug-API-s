/* eslint-disable no-unused-vars */

const profileData = require('../../services/profile-data');
const userMediaData = require('../../services/user-media-data');

const sourceLogger = require('../../source-logger');

const getUserMediaData = async (parent, args, context) => {
  try {
    // const { req: { } } = context;
    const { data = {} } = args;
    const { accessToken } = data;
    const instaUser = await profileData(accessToken, context);
    const instaUserId = instaUser.id;
    const response = await userMediaData(instaUserId, accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from getUserMediaData resolver => ${error}`, context);
    throw error;
  }
};
module.exports = getUserMediaData;
