const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require('@apollo/server/plugin/landingPage/default');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const Sentry = require('@sentry/node');
const { GraphQLError } = require('graphql');

const packageJson = require('../package.json');

const CONFIG = require('./config/config');
const applyDirective = require('./directives');
const { logger } = require('./logger');
const { resolvers, typeDefs } = require('./modules');
const sequelizeClient = require('./sequelize-client');
const { models } = require('./sequelize-client');
const depthLimitRule = require('./shared-lib/depth-limit-rule');
const queryComplexityPlugin = require('./shared-lib/query-complexity-plugin');
const sentryLogsPlugin = require('./shared-lib/sentry-logs-plugin');
const addRequestMetaToCtx = require('./utils/auth/add-request-meta-to-ctx');
const getUser = require('./utils/auth/get-user');
const addLocaleServiceToCtx = require('./utils/intl/add-locale-service-to-ctx');
const { getMessage } = require('./utils/messages');

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = applyDirective(schema);

Sentry.init({
  dsn: CONFIG.SENTRY_DSN,
  environment: CONFIG.ENV || 'development',
  release: packageJson.version,
});

const INTROSPECTION_ALLOWED_ENVIRONMENTS = ['boilerplate', 'localhost', 'dev', 'development', 'staging'];

async function startApolloServer(app, localeService) {
  try {
    console.log(INTROSPECTION_ALLOWED_ENVIRONMENTS.includes(CONFIG.ENV));
    const server = new ApolloServer({
      schema,

      introspection: INTROSPECTION_ALLOWED_ENVIRONMENTS.includes(CONFIG.ENV),
      playground: INTROSPECTION_ALLOWED_ENVIRONMENTS.includes(CONFIG.ENV),
      plugins: [
        queryComplexityPlugin(schema),
        sentryLogsPlugin.create(Sentry),
        INTROSPECTION_ALLOWED_ENVIRONMENTS.includes(CONFIG.ENV)
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      formatError: error => {
        console.log(error);
        let message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '');

        if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
          return { ...error, message };
        }

        const { extensions: { type } } = error;

        if (type !== 'CUSTOM_GRAPHQL_ERROR') {
          if (error.message === getMessage('RATE_LIMIT')) {
            message = error.message;
            return { message };
          }
          console.log({ error });
          message = getMessage('INTERNAL_SERVER_ERROR'); // FOR SERVER ERRORS
          return { message };
        }

        return { ...error, message };
      },
      subscriptions: {
        path: `/${CONFIG.API_PREFIX_ROUTE}/graphql`,
        onConnect: connectionParams => {
          if (CONFIG.ENV === 'development') {
            logger.info('------------onConnect---------------');
          }
          if (connectionParams && connectionParams.authorization) {
            return getUser(connectionParams.authorization, models)
              .then(user => ({ user })).catch(() => { throw new GraphQLError('Not Authorized!'); });
          }
          throw new Error('Missing auth token!');
        },
      },
      validationRules: [depthLimitRule(CONFIG.DEPTH_LIMIT_CONFIG)],
    });

    await server.start();

    app.use(`/${CONFIG.API_PREFIX_ROUTE}/graphql`, expressMiddleware(server, {
      context: async ctx => {
        if (ctx.connection) {
          return { connection: ctx.connection };
        }
        addLocaleServiceToCtx.localeServiceMethod(ctx, localeService);
        addRequestMetaToCtx.setLocaleServiceToCtx(ctx);
        return {
          ...ctx,
          req: ctx.req,
          res: ctx.res,
          models: sequelizeClient.models,
        };
      },
    }));
  } catch (error) {
    logger.error(`ERROR STARTING APOLLO SERVER >> ${error}`);
    throw error;
  }
}

module.exports = startApolloServer;
