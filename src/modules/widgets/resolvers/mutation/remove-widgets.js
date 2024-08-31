/* eslint-disable no-unused-vars */
const { sequelize } = require('../../../../sequelize-client');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { getMessage } = require('../../../../utils/messages');
const widgetLogger = require('../../widgets-logger');

const deleteWidgets = async (parent, args, context) => {
  const { models, localeService } = context;
  const { where = {} } = args;
  const { id: widgetId } = where;
  const transaction = await sequelize.transaction();
  try {
    const widget = await models.Widgets.count({ where: { id: widgetId } });
    // console.log(widgets);
    if (!widget) {
      throw new CustomGraphqlError(getMessage('WIDGETS_NOT_FOUND'));
    }

    await models.Layout.destroy({
      where: {
        widgetId,
      },
      transaction,
    });
    await models.Source.destroy({
      where: {
        widgetId,
      },
      transaction,
    });
    await models.Style.destroy({
      where: {
        widgetId,
      },
      transaction,
    });

    await models.Widgets.destroy({
      where: {
        id: widgetId,
      },
      transaction,
    });

    await transaction.commit();
    const response = {
      message: getMessage('WIDGETS_DELETED', localeService),
    };
    return response;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    widgetLogger.error(`error from deleteWidgets resolver => ${error}`, context);
    throw error;
  }
};
module.exports = deleteWidgets;

