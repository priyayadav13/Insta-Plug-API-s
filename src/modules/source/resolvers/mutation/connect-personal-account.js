const connectPersonalAccountService = require('../../services/connect-personal-account');

const sourceLogger = require('../../source-logger');

const connectPersonalAccount = async (parent, args, context) => {
  try {
    // const { req: { } } = context;
    const { where = {}, data = {} } = args;
    const { authorizeCode } = data;
    const { id: widgetId } = where;

    const response = await connectPersonalAccountService(widgetId, authorizeCode, context);
    return response;
  } catch (error) {
    sourceLogger.error(`error from connectPersonalAccount resolver => ${error}`, context);
    throw error;
  }
};
module.exports = connectPersonalAccount;
