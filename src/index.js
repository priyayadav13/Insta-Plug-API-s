/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const http = require('http');

const { config } = require('process');

const cors = require('cors');
const express = require('express');

const packageJson = require('../package.json');

const bootFiles = require('./boot');

const CONFIG = require('./config/config');
const { VERSION_ROUTE, REST_API_PREFIX } = require('./constants/api-constants');
const errorHandler = require('./rest/middlewares/error-handler');
const setLocaleServiceInReq = require('./rest/middlewares/set-locale-service-in-req');
const setLogInfoInReq = require('./rest/middlewares/set-log-info-in-req');
const restRoutes = require('./rest/routes');
const sequelizeClient = require('./sequelize-client');
const Logger = require('./shared-lib/logger');
const startApolloServer = require('./start-apollo-server');
const i18n = require('./utils/intl/i18n-config');
const LocaleService = require('./utils/intl/locale-service');
const queryLengthMiddleware = require('./utils/query-length-middleware');

const app = express();
const corsOptions = { credentials: true, origin: true };
const logger = new Logger('index');

const localeService = new LocaleService(i18n);

// CORS AND PARSERS
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PRE REQUEST EXECUTION MIDDLEWARES
app.use(setLogInfoInReq);
app.use(setLocaleServiceInReq(localeService));
app.use('*', queryLengthMiddleware);

// APIS
app.get(`/${CONFIG.API_PREFIX_ROUTE}${VERSION_ROUTE}`, (req, res) => { res.json({ version: packageJson.version }); });
app.use(`/${CONFIG.API_PREFIX_ROUTE}${REST_API_PREFIX}`, restRoutes);

// POST REQUEST EXECUTION MIDDLEWARES
app.use(errorHandler);

app.get('/get-instagram-code', (req, res, next) => res.send(
  `<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_media,user_profile,instagram_basic,pages_read_engagement,pages_show_list&response_type=code'> Connect to Instagram </a>`,
));

app.get('/get-facebook-code', (req, res, next) => res.send(
  `<a href='https://www.facebook.com/dialog/oauth?disply=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement&client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}'> Connect to Facebook </a>`,
));

const initServer = async () => {
  try {
    startApolloServer(app, localeService);
    const httpServer = http.createServer(app);
    await sequelizeClient.sequelize.sync();
    await bootFiles();
    httpServer.listen(CONFIG.PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${CONFIG.PORT}/${CONFIG.API_PREFIX_ROUTE}/graphql`);
    });
    return true;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

initServer();

module.exports = app;
