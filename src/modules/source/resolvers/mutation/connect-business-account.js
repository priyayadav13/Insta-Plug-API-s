const connectToBusinessAccountService = require('../../services/connect-business-account');

const sourceLogger = require('../../source-logger');

// eslint-disable-next-line consistent-return
const connectBusinessAccount = async (parent, args, context) => {
  try {
    const { where = {}, data = {} } = args;
    const { authorizeCode } = data;
    const { id: widgetId } = where;

    const response = await connectToBusinessAccountService(widgetId, authorizeCode, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from connectToBusinessAccount resolver => ${error}`, context);
    throw error;
  }
};

module.exports = connectBusinessAccount;
