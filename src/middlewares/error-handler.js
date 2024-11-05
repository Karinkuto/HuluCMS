module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      strapi.log.error(error);
      
      ctx.status = error.status || 500;
      ctx.body = {
        error: {
          message: error.message || 'Internal server error',
          status: ctx.status,
          details: process.env.NODE_ENV === 'development' ? error.details : undefined
        }
      };
    }
  };
}; 