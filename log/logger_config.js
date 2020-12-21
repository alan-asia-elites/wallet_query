const log4js = require('koa-log4');
const path = require('path');

log4js.configure({
  appenders: {
    info: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join('log/infos/', 'info'),
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join('log/errors/', 'error'),
      alwaysIncludePattern: true
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'info' },
    info: { appenders: [ 'info' ], level: 'info' },
    error: { appenders: [ 'error' ], level: 'error'}
  }
});

exports.logger = log4js.getLogger('info');
exports.errorLogger = log4js.getLogger('error');
