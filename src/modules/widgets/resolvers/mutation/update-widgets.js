/* eslint-disable prefer-const */
// const WidgetsModel = require('../../../../schema/main-server/models/widgets.model');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { getMessage } = require('../../../../utils/messages');
const widgetLogger = require('../../widgets-logger');

const updateWidgets = async (parent, args, context) => {
  // const { widgetsId } = context.req.query;
  const { where = {}, data = {} } = args;
  const { id: widgetId } = where;
  const {
    models: {
      Widgets: WidgetsModel,
    },
    localeService,
  } = context;
  try {
    const widget = await WidgetsModel.findOne({ where: { id: widgetId } });
    if (!widget) {
      throw new CustomGraphqlError(getMessage('WIDGETS_NOT_FOUND'));
    }

    const updateWidgetInstance = await WidgetsModel.update(data, {
      where: {
        id: widgetId,
      },
      returning: true,
    });

    const [count] = updateWidgetInstance;
    let response = {
      message: getMessage('WIDGET_UPDATED_SUCCESSFULLY', localeService),
    };

    if (count === 0) {
      response.data = widget;
    } else {
      const [[updatedWidget]] = updateWidgetInstance;
      response.data = updatedWidget;
    }

    return response;
  } catch (error) {
    widgetLogger.error(`error from updateWidgets resolver => ${error}`, context);
    throw error;
  }
};

module.exports = updateWidgets;
