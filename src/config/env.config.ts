export const EnvConfiguration =() => ({
    enviroment: process.env.NODE_ENV || 'dev',
    db_url: process.env.DB_URL,
    port: +process.env.PORT || 3002,
    default_limit: +process.env.DEFAULT_LIMIT || 10
});