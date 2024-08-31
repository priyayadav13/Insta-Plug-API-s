const addFilterBySourceId = require('./mutation/add-filter-by-source-id');
const businessAccessToken = require('./mutation/business-access-token');
const BusinessMediaData = require('./mutation/business-media-data');
const businessProfileData = require('./mutation/business-profile-data');
const connectBusinessAccount = require('./mutation/connect-business-account');
const connectPersonalAccount = require('./mutation/connect-personal-account');
const createInput = require('./mutation/connect-public-account');
const longLivedAccessToken = require('./mutation/long-lives-access-token');
const profileData = require('./mutation/profile-data');
const userMediaData = require('./mutation/user-media-data');
const getPostBySourceId = require('./query/get-post');

const resolvers = {
  Mutation: {
    createInput,
    addFilterBySourceId,
    connectPersonalAccount,
    longLivedAccessToken,
    profileData,
    userMediaData,
    connectBusinessAccount,
    businessAccessToken,
    businessProfileData,
    BusinessMediaData,

  },
  Query: {
    getPostBySourceId,

  },
};

module.exports = resolvers;
