/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const {
  models: {
    user: userModel, Widgets: WidgetsModel, ServiceAuthToken: ServiceAuthTokenModel,
  }, sequelize: { Op },
} = require('../sequelize-client');
const Logger = require('../shared-lib/logger');
const generatePassword = require('../utils/auth/generate-password');

const logger = new Logger('boot-script');

const userData = require('./data/user-data');

const createUser = async () => {
  try {
    const userData = [];
    for (const user of userData) {
      const widgets = await WidgetsModel.findOne({ where: { name: { [Op.iLike]: user.widgets } } });
      const serviceAuthToken = await ServiceAuthTokenModel.findOne({ where: { name: { [Op.iLike]: user.serviceAuthToken } } });
      const count = await userModel.findOne({ where: { email: { [Op.iLike]: user.userModel } } });
      if (widgets && serviceAuthToken) {
        if (!count) {
          user.password = generatePassword(user.password);
          user.widgetsId = widgets.id;
          user.serviceAuthTokenId = serviceAuthToken.id;
          userData.push(user);
        }
      }
    } if (userData.length) {
      await userModel.bulkCreate(userData);
    }
  } catch (error) {
    logger.error('Error while creating boot data for user: $(error)', {});
  }
};
module.exports = createUser;
