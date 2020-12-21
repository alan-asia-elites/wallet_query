const Koa = require('koa');
const koaBody = require('koa-body');
const config = require('./config/config');
const router = require('./router/router');
const errorHandler = require('./common/core').errorResponse;
const { logger, errorLogger } = require('./log/logger_config');
const app = new Koa();

app.use(errorHandler);
app.use(koaBody({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.PORT).on("error", err => {
  console.error(err);
  logger.error(err);
  errorLogger.error(err);
});
console.log('app is listen ' + config.PORT);