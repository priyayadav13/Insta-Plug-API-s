/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const { get } = require('axios').default;

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const profileData = async (accessToken, context) => {
  let response;
  try {
    response = await get('https://graph.instagram.com/me', {
      params: {
        fields: 'id,username,media_count,account_type',
        access_token: accessToken,
      },
      headers: {
        host: 'graph.instagram.com',
      },
    });
  } catch (error) {
    return new CustomGraphqlError(error);
  }
  response = response.data;
  return response;
};
module.exports = profileData;
