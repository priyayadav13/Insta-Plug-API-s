/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const { promisify } = require('util');

const { post } = require('request');

const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../../utils/messages');
const sourceLogger = require('../source-logger');

const connectToPersonalAccount = async (widgetId, authorizationCode, context) => {
  try {
    const {
      models: {
        Source: SourceModel,
        ServiceAuthToken: ServiceAuthTokenModel,
      },
    } = context;

    const sourceWhere = {
      sourceType: 'PERSONAL_ACCOUNT',
      widgetId,
    };

    const sourceExist = await SourceModel.findOne({ where: sourceWhere });

    const postAsync = promisify(post);
    const { body, statusCode } = await postAsync({
      url: 'https://api.instagram.com/oauth/access_token',
      formData: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: authorizationCode,
        grant_type: 'authorization_code',
      },
      headers: {
        'content-type': 'multipart/fromData',
        host: 'api.instagram.com',
      },
    });
    const result = JSON.parse(body);
    if (statusCode === 400) {
      throw new CustomGraphqlError(result.error_message);
    }

    const serviceAuthTokenData = {
      service: 'INSTAGRAM',
      accessToken: result.access_token,
      referenceData: {
        userId: result.user_id,
      },
    };

    if (sourceExist) {
      serviceAuthTokenData.sourceId = sourceExist.id;
    } else {
      const createSourceData = {
        sourceType: 'PERSONAL_ACCOUNT',
        widgetId,
      };
      const source = await SourceModel.create(createSourceData);
      serviceAuthTokenData.sourceId = source.id;
    }

    await ServiceAuthTokenModel.create(serviceAuthTokenData);
    return result;
  } catch (error) {
    sourceLogger.error(`error from connectToPersonalAccount resolver => ${error}`, context);
    throw error;
  }
};

module.exports = connectToPersonalAccount;
