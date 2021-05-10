import 'dotenv/config';

export default () => ({
  api: {
    port: process.env.API_PORT ?? '',
  },
  db: {
    host: process.env.DB_HOST ?? '',
    port: process.env.DB_PORT ?? '',
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? '',
    port: process.env.REDIS_PORT ?? '',
  },
});
