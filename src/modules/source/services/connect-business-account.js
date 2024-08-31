/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const { promisify } = require('util');

const { post } = require('request');

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const connectToBusinessAccountService = async (widgetId, authorizationCode, context) => {
  try {
    const {
      models: {
        Source: SourceModel,
        ServiceAuthToken: ServiceAuthTokenModel,
      },
    } = context;

    const sourceWhere = {
      sourceType: 'BUSINESS_ACCOUNT',
      widgetId,
    };
    const sourceExist = await SourceModel.findOne({ where: sourceWhere });
    const postAsync = promisify(post);
    const { body, statusCode } = await postAsync({
      url: 'https://graph.facebook.com/v16.0/me/accounts',
      formData: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code: authorizationCode,
        grant_type: 'client_credentials',
      },
      headers: {
        'content-type': 'multiple/fromData',
        host: 'graph.facebook.com',
      },
    });
    const result = JSON.parse(body);
    if (statusCode === 400) {
      // console.log({ result });
      throw new CustomGraphqlError(result.error.message);
    }
    const serviceAuthTokenData = {
      service: 'FACEBOOK',
      accessToken: result.access_token,
      referenceData: {
        userId: result.user_id,
      },
    };
    if (sourceExist) {
      serviceAuthTokenData.sourceId = sourceExist.id;
    } else {
      const createSourceData = {
        sourceType: 'BUSINESS_ACCOUNT',
        widgetId,
      };
      const source = await SourceModel.create(createSourceData);
      serviceAuthTokenData.sourceId = source.id;
    }
    await ServiceAuthTokenModel.create(serviceAuthTokenData);
    return result;
  } catch (error) {
    console.log(error);
    sourceLogger.error(`error from connectToBusinessAccountService resolver => ${error}`, context);
    throw error;
  }
};
module.exports = connectToBusinessAccountService;
