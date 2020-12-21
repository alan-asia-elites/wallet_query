const { logger, errorLogger } = require("../log/logger_config");

module.exports = {

  async errorResponse(ctx, next) {
    try {
      ctx.error = (code, message) => {
        if (typeof code === "string") {
          message = code;
          code = 500;
        }
        ctx.throw(code || 500, message || "服务器错误");
      };
      await next();
    } catch (e) {
      let status = e.status || 500;
      let message = e.message || "服务器错误";
      let stack = e.stack;
      ctx.response.body = {
        status,
        message,
        url: ctx.request.url,
        data: ctx.request.body,
        stack,
      };
      logger.error(ctx.response.body);
      errorLogger.error(ctx.error);
    }
  },

  async corsSet(ctx, next) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Headers", "*");
    ctx.set("Content-Type", "application/json;charset=utf-8");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 600);

    if (ctx.request.method == "OPTIONS") {
      ctx.response.status = 200;
      return;
    }

    await next();
  },

  async preDataFilter(ctx, next) {
    ctx.request.data = Object.assign({}, ctx.request.query, ctx.request.body);
    await next();
  },

  async sessionCheck(ctx, next) {
    await next();
  },
};
