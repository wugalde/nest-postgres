import * as joi from 'joi';

export const JoivalidationSchema = joi.object({
    PORT: joi.number().default(3000),
    HOST_API: joi.required(),
    DBPG_HOST: joi.required(),
    JWT_SECRET: joi.required(),
    DBPG_PORT: joi.number().required(),


    DEFAULT_LIMIT: joi.number().default(10)
});