const profileData = require('../../services/profile-data');

const sourceLogger = require('../../source-logger');

const getProfileData = async (parent, args, context) => {
  try {
    // const { req: { } } = context;
    const { data = {} } = args;
    const { accessToken } = data;
    const response = await profileData(accessToken, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from getProfileData resolver => ${error}`, context);
    throw error;
  }
};
module.exports = getProfileData;
