/* eslint-disable camelcase */
const CONFIG = require('./config');

const credentials = {
  type: 'service_account',
  project_id: CONFIG.FIREBASE.PROJECT_ID,
  private_key_id: CONFIG.FIREBASE.PRIVATE_KEY_ID,
  private_key: CONFIG.FIREBASE.PRIVATE_KEY,
  client_email: CONFIG.FIREBASE.CLIENT_EMAIL,
  client_id: CONFIG.FIREBASE.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: CONFIG.FIREBASE.CLIENT_URL,
};

module.exports = credentials;
