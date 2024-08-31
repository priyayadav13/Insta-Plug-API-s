/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/order
const { get } = require('axios').default;

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const longLivedAccessToken = async (accessToken, context) => {
  let response;
  try {
    response = await get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: accessToken,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
  } catch (error) {
    sourceLogger.error(`error from longLivedAccessToken resolver => ${error}`, context);
    throw error;
  }
  response = response.data;
  return response;
};

module.exports = longLivedAccessToken;
