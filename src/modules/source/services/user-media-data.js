/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { get } = require('axios').default;
const axios = require('axios');

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const userMediaData = async (instaUserId, accessToken, context) => {
  let response;
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.instagram.com/${instaUserId}/media?fields=id,caption,media_type,media_url,username,timestamp,thumbnail_url,permalink&access_token=${accessToken}`,
      headers: {
        Cookie: 'csrftoken=WP2AgiFEBsu9XkQqXLMmvtODazMYe99x; ig_nrcb=1',
      },
    };

    response = await axios.request(config);
  } catch (error) {
    // console.log(error);
    sourceLogger.error(`error from userMediaData resolver => ${error}`, context);
    throw error;
  }
  response = response.data.data;
  return response;
};

module.exports = userMediaData;
