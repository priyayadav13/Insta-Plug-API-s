const { getMessage } = require('../../../../utils/messages');
const sourceLogger = require('../../source-logger');

const createInput = async (parent, args, context) => {
  try {
    const { data = {} } = args;
    const { input, widgetId } = data;

    const {
      models: {
        Source: SourceModel,
      }, localeService,
    } = context;

    const sourceWhere = {
      sourceType: 'PUBLIC_ACCOUNT',
      widgetId,
    };

    const sourceExist = await SourceModel.findOne({ where: sourceWhere });

    if (sourceExist) {
      await sourceExist.update({ input });
    } else {
      const createSourceData = {
        input,
        sourceType: 'PUBLIC_ACCOUNT',
        widgetId,
      };
      await SourceModel.create(createSourceData);
    }

    const response = {
      message: getMessage('INPUT_CREATE_SUCCESSFULLY', localeService),
    };
    return response;
  } catch (error) {
    sourceLogger.error(`error from createInput resolver => ${error}`, context);
    throw error;
  }
};

module.exports = createInput;
