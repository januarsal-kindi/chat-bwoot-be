import Joi from 'joi';

const canonicalOrigin = Joi.string().custom(
  (value: string, helpers: Joi.CustomHelpers) => {
    try {
      const url = new URL(value);

      return url.origin === value && !url.username && !url.password
        ? value
        : helpers.error('string.origin');
    } catch {
      return helpers.error('string.origin');
    }
  },
  'canonical origin',
);

function originList(schemes: string[]) {
  return Joi.string()
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      const origins = value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);

      if (origins.length === 0) {
        return helpers.error('array.min');
      }

      for (const origin of origins) {
        const { error } = canonicalOrigin
          .uri({ scheme: schemes })
          .validate(origin);

        if (error) {
          return helpers.error('string.origin');
        }
      }

      return [...new Set(origins)];
    }, 'comma-separated canonical origins')
    .required();
}

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  JWT_ACCESS_SECRET: Joi.string()
    .pattern(/^[A-Za-z0-9+/]{43}=$/)
    .required(),
  GEMINI_API_KEY: Joi.string().required(),
  FRONTEND_ORIGIN: Joi.when('NODE_ENV', {
    is: 'production',
    then: originList(['https']),
    otherwise: originList(['http', 'https']),
  }),
});
