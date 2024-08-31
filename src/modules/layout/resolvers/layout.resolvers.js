// const createLayoutByWidgetId = require('./mutation/add-layout-by-widget-id');
// const createColumnsRows = require('./mutation/create-columns-rows');
// const createFeedTitle = require('./mutation/create-feed-title');
// const showHeaders = require('./mutation/headers');
const createOrUpdateLayout = require('./mutation/create-or-update-layout');

const resolvers = {
  Mutation: {
    // createLayoutByWidgetId,
    // createFeedTitle,
    createOrUpdateLayout,
    // createColumnsRows,
    // showHeaders,
  },
};

module.exports = resolvers;
