/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const layoutModel = require('../../../../schema/main-server/models/layout.model');
const { getMessage } = require('../../../../utils/messages');
const { layoutLogger } = require('../../layout-logger');

const createOrUpdateLayout = async (parent, args, context) => {
  try {
    const { data } = args;
    const {
      layoutType, feedTitle, widgetId, headerInput,
    } = data;
    console.log(data);
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

    const sliderSettings = {};
    if (layoutType === 'SLIDER') {
      sliderSettings = args.sliderSettings || {};
      sliderSettings.arrowControl = typeof sliderSettings.arrowControl === 'boolean' ? sliderSettings.arrowControl : true;
      sliderSettings.dragControl = typeof sliderSettings.dragControl === 'boolean' ? sliderSettings.dragControl : true;
      sliderSettings.animationSpeed = typeof sliderSettings.animationSpeed === 'number' ? sliderSettings.animationSpeed : 5;
      sliderSettings.autoplay = typeof sliderSettings.autoplay === 'number' ? sliderSettings.autoplay : 10;
    }

    if (layoutExist) {
      await layoutExist.update({
        layoutType, sliderSettings, feedTitle, headerInput,
      });
    } else {
      const CreateOrUpdateLayout = {
        layoutType, feedTitle, headerInput,
      };
      await LayoutModel.create(CreateOrUpdateLayout);
    }
    const headers = [];

    if (headerInput) {
      headers = ['Profile Picture', 'Full Name', 'UserName', 'Verified Badge', 'Posts Count', 'Followers Count', 'Following Count', 'Follow Button'];
    }

    const response = {
      message: getMessage('CREATE_OR_UPDATE_LAYOUT_SUCCESSFULLY', localeService),
    };
    return response;
  } catch (error) {
    console.log(error);
    layoutLogger.error(`error from createOrUpdateLayout resolver => ${error}`, context);
    throw error;
  }
};

module.exports = createOrUpdateLayout;
