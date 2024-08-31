const createWidgets = require('./mutation/create-widgets');
const removeWidgets = require('./mutation/remove-widgets');
const updateWidgets = require('./mutation/update-widgets');
// const sample = () => 'sample;';

const resolvers = {
  Mutation: {
    createWidgets,
    updateWidgets,
    removeWidgets,
  },
  // Query: {
  //   // sample,
  // },
};

module.exports = resolvers;
