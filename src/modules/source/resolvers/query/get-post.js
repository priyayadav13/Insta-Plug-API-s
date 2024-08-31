/* eslint-disable no-unused-vars */
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { getMessage } = require('../../../../utils/messages');
const userMediaData = require('../../services/user-media-data');
const sourceLogger = require('../../source-logger');

const getPostBySourceId = async (parent, args, context) => {
  const { sourceId, mentionedUserIds } = args;
  const { models, currentUser } = context;

  try {
    const source = await models.Source.findByPk(sourceId, {
      include: [
        {
          model: models.Widgets,
          as: 'widgets',
          attributes: ['id'],
        },
      ],
    });
    if (!source) {
      throw new CustomGraphqlError(getMessage('SOURCE_NOT_FOUND'));
    }

    if (source.sourceType === 'PERSONAL_ACCOUNT') {
      const serviceToken = await models.ServiceAuthToken.findOne({ where: { sourceId } });
      if (serviceToken) {
        const { referenceData, accessToken } = serviceToken;
        const { userId } = referenceData;
        const post = await userMediaData(userId, accessToken, context);
        console.log({ post });
      }
    }

    if (source.sourceType === 'BUSINESS_ACCOUNT') {
      const serviceToken = await models.ServiceAuthToken.findOne({ where: { sourceId } });
      if (serviceToken) {
        const { referenceData, accessToken } = serviceToken;
        const { userId } = referenceData;
        const post = await userMediaData(userId, accessToken, context);
        console.log({ post });
      }
    }
    return source;
  } catch (error) {
    console.log(error);
    sourceLogger.error(`error from getPostBySourceId resolver => ${error}`, context);
    throw error;
  }
};

module.exports = getPostBySourceId;
