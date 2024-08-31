/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const { get } = require('axios').default;

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const businessProfileDataService = async (accessToken, context) => {
  let response;

  try {
    // console.log('-------', accessToken);
    response = await get('https://graph.facebook.com/v16.0/100091644130507/', {
      params: {
        access_token: accessToken,
      },
      headers: {
        host: 'graph.facebook.com',
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return new CustomGraphqlError(error);
  }
};
module.exports = businessProfileDataService;
