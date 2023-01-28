import * as joi from 'joi';

export const JoivalidationSchema = joi.object({
    PORT: joi.number().default(3000),
    DB_URL: joi.required(),
    DEFAULT_LIMIT: joi.number().default(10)
});