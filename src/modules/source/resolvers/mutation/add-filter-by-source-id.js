/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');

const sourceModel = require('../../../../schema/main-server/models/source.model');
const { getMessage } = require('../../../../utils/messages');
const { sourceLogger } = require('../../source-logger');

const createFilterBySourceId = async (parent, args, context) => {
  try {
    const { data } = args;
    const { filter, sourceId } = data;

    const {
      models: {
        Source: SourceModel,
      }, localeService,
    } = context;

    const sourceWhere = {
      id: sourceId,
    };
    const sourceExist = await SourceModel.findOne({ where: sourceWhere });

    if (sourceExist) {
      await sourceExist.update({ filter });
    } else {
      const createSourceData = {
        filter,
      };
      await sourceModel.create(createSourceData);
    }

    const response = {
      message: getMessage('FILTER_CREATE_SUCCESSFULLY', localeService),
    };
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createFilterBySourceId;
