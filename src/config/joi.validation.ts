import * as joi from 'joi';

export const JoivalidationSchema = joi.object({
    PORT: joi.number().default(3000),
    DBPG_HOST: joi.required(),
    DBPG_PORT: joi.number().required(),
    DEFAULT_LIMIT: joi.number().default(10)
});