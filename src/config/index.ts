export default () => ({
  environment: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost:3000',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  apiKeys: process.env.API_KEY,
});
