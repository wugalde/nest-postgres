export const EnvConfiguration =() => ({
    enviroment: process.env.NODE_ENV || 'dev',
   
    port: +process.env.PORT || 3002,
    db_host: process.env.DBPG_HOST,
    db_port: process.env.DBPG_PORT,
    db_user: process.env.DBPG_USER,
    db_name: process.env.DBPG_NAME,

    hots_api: process.env.HOST_API,

    jwt_secret: process.env.JWT_SECRET,
    
    default_limit: +process.env.DEFAULT_LIMIT || 10
});
