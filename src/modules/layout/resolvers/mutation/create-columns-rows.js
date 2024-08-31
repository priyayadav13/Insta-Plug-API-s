/* eslint-disable no-unused-vars */
const layoutModel = require('../../../../schema/main-server/models/layout.model');
const { getMessage } = require('../../../../utils/messages');
const { layoutLogger } = require('../../layout-logger');

const createColumnsRows = async (parent, args, context) => {
  try {
    const { data } = args;
    const {
      columnsModes, widgetId, autoConfig, manualConfig,
    } = data;

    const {
      models: {
        Layout: LayoutModel,
        // Config: ConfigModel,
      }, localeService,
    } = context;
    const layoutWhere = {
      id: widgetId,
    };
    const layoutExist = await LayoutModel.findOne({ where: layoutWhere });

    if (layoutExist) {
      await layoutExist.update({ columnsModes, autoConfig, manualConfig });
    } else {
      const createColumnModes = {
        columnsModes, autoConfig, manualConfig,
      };
      await LayoutModel.create(createColumnModes);
    }
    const response = {
      message: getMessage('COLUMNS_ROWS_CREATE_SUCCESSFULLY', localeService),
    };
    return response;
  } catch (error) {
    layoutLogger.error(`error from createColumnsRows resolver => ${error}`, context);
    throw error;
  }
};
module.exports = createColumnsRows;
