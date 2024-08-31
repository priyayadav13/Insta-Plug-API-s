const axios = require('axios');

const sourceLogger = require('../source-logger');

const businessMediaDataService = async (instaUserId, accessToken, context) => {
  let response;
  try {
    const config = {
      method: 'get',
      maxBOdyLength: Infinity,
      url: `https://graph.instagram.com/${instaUserId}/media?fields=id,caption,media_type,media_url,username,timestamp,thumbnail_url,permalink&access_token=${accessToken}`,
      headers: {
        Cookie: 'csrftoken=WP2AgiFEBsu9XkQqXLMmvtODazMYe99x; ig_nrcb=1',
      },
    };

    response = await axios.request(config);
  } catch (error) {
    console.log(error);
    sourceLogger.error(`error from userMediaData resolver => ${error}`, context);
    throw error;
  }
  response = response.data.data;
  return response;
};
module.exports = businessMediaDataService;
