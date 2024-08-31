/* eslint-disable no-unused-vars */
// const WidgetsModel = require('../../../../schema/main-server/models/widgets.model');
// const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { getMessage } = require('../../../../utils/messages');
const widgetLogger = require('../../widgets-logger');

const createWidgets = async (parent, args, context) => {
  try {
    const { data = {} } = args;
    const { name } = data;

    const {
      models: {
        Widgets: WidgetsModel,
      }, localeService,
    } = context;

    const widget = await WidgetsModel.create({
      name,
    });

    const response = {
      data: widget,
      message: getMessage('WIDGET_CREATE_SUCCESSFULLY', localeService),
    };
    return response;
  } catch (error) {
    widgetLogger.error(`error from resolver => ${error}`, context);
    throw error;
  }
};

module.exports = createWidgets;
