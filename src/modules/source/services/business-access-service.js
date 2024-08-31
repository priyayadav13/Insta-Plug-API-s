/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const { get } = require('axios').default;

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const businessAccessTokenService = async (accessToken, context) => {
  let response;
  // console.log(response);
  try {
    // console.log(accessToken);
    response = await get('https://graph.facebook.com/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_secret: process.env.FACEBOOK_APP_SECRET,
        access_token: accessToken,
      },
      headers: {
        host: 'graph.facebook.com',
      },
    });
  } catch (error) {
    // console.log(error);
    sourceLogger.error(`error from businessAccessService resolver ${error}`, context);
    throw error;
  }
  response = response.data;
  return response;
};

module.exports = businessAccessTokenService;
