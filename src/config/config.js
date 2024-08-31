require('dotenv').config();

const config = {
  ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  SENTRY_DSN: process.env.SENTRY_DSN,
  DEPTH_LIMIT_CONFIG: Number(process.env.QUERY_DEPTH_LIMIT) || 5,
  QUERY_LENGTH_LIMIT: Number(process.env.QUERY_LENGTH_LIMIT) || 3500,
  COMPLEXITY_THRESHOLD: Number(process.env.COMPLEXITY_THRESHOLD) || 60,
  QUERY_PAGING_MIN_COUNT: Number(process.env.QUERY_PAGING_MIN_COUNT) || 10,
  QUERY_PAGING_MAX_COUNT: Number(process.env.QUERY_PAGING_MAX_COUNT) || 50,
  API_PREFIX_ROUTE: process.env.API_PREFIX_ROUTE || 'api',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  BYPASS_RATE_LIMIT: process.env.BYPASS_RATE_LIMIT === 'true',
  JWT: {
    SECRET: process.env.JWT_SECRET,
    LIFE_TIME: process.env.JWT_LIFE_TIME,
    REFRESH_TOKEN_LIFE_TIME: process.env.JWT_REFRESH_TOKEN_LIFE_TIME,

  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PASSWORD: process.env.REDIS_PASSWORD,
    PORT: process.env.REDIS_PORT,
    TLS: process.env.REDIS_TLS === 'true',
  },
  AWS: {
    ACCESS_ID: process.env.AWS_ACCESS_ID,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    S3_REGION: process.env.AWS_S3_REGION,
    S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    CLOUDFRONT_ID: process.env.AWS_CLOUDFRONT_ID,
    CLOUDFRONT_PRIVATE_KEY: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
    CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN,
  },

  FIREBASE: {
    CONFIG_FILE: process.env.FIREBASE_CONFIG_FILE,
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
    CLIENT_URL: process.env.FIREBASE_CLIENT_URL,
  },

  RATE_LIMIT: {
    DEFAULT_WINDOW_IN_MS: Number(process.env.RATE_LIMIT_DEFAULT_WINDOW_IN_MS) || 1 * 60 * 1000,
    MAX_REQUESTS_PER_WINDOW: Number(process.env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW) || 30,
  },
};

module.exports = config;
