const config = {
  app: {
    environment: process.env.APP_ENVIRONMENT,
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  fintech: {
    baseUrl: process.env.FINTECH_BASE_URL,
    fintechUATBaseUrl: process.env.FINTECH_UAT_BASE_URL,
  },
};

module.exports = config;
