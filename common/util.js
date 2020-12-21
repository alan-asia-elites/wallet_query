const querystring = require('querystring');
const axios = require('axios');
const md5 = require('js-md5');
const token = require('./token');
const config = require('../config/config');
const error = require('../config/error');
const crypto = require('./crypto');
const { logger, errorLogger } = require('../log/logger_config');

const secret_pwd = '9Py2uru8no7lRGRu0UAJSfaKes9XHh2g';

module.exports = {

    formatDigitalToTime(digital){

        let ht = digital
        let h = Math.floor(ht / 3600)

        let mt = ht - (h*3600)
        let m = Math.floor(mt / 60)

        let s = mt % 60

        h = String(h).padStart(2,'0')
        m = String(m).padStart(2,'0')
        s = String(s).padStart(2,'0')

        return h + ':' + m + ':' + s
    },

    formatTimeToDigital(time){

        let time_arr = time.split(':')
        let hs = parseInt(time_arr[0])*3600
        let ms = parseInt(time_arr[1])*60
        let s = parseInt(time_arr[2])

        return hs+ms+s
    },


    makeCode(len = 4) {
        let text = "";
        let possible = "abcdefghkmnrstuvxyz234568";

        for (let i = 0; i < len; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },

    failResponse(errCode = 'E1001', errMsg = '') {
        if (errMsg !== '') return { 'code': errCode, 'msg': errMsg };
        let result = { 'result': 0, 'err': { 'code': errCode, 'msg': eval("error." + errCode) } };
        logger.error(result);
        errorLogger.error(result);
        return result;
    },

    successResponse(data = {}) {
        let result = { 'result': 1, 'data': data };
        logger.info(result);
        return result
    },

    makeResponseSign(body, secret) {
        let sign = crypto.encodeAES(JSON.stringify(body), secret);
        logger.info('response sign : ' + sign);
        return sign;
    },

    nowTime() {
        return Date.parse(new Date()) / 1000;
    },

    nowTimeMillisecond() {
        return new Date().getTime();
    },

    passwordConvert(pwd) {
        return md5("al" + pwd + "an")
    },

    sleep(ms = 0) {
        return new Promise(resolve => setTimeout(() => { resolve('sleep ' + ms); }, ms))
    },

    makeToken(account) {
        return token.create(account, this.nowTime());
    },

    parseToken(data) {
        return token.parse(data);
    },

    makeSign(data) {

        let key = data.appKey;
        let secret = config.SIGN_SECRET[key];
        let str = JSON.stringify(data);

        let strSecretData = key + secret + str;
        return md5(md5(strSecretData));
    },

    passwordEncode(pwd) {
        return crypto.encodeAES(pwd, secret_pwd)
    },

    formatStrToTime(str) {

    },

    isPrototype(data) {
        return Object.prototype.toString.call(data).toLowerCase()
    },

    isArray(data) {
        return this.isPrototype(data) === '[object array]'
    },

    isJSON(data) {
        return this.isPrototype(data) === '[object object]'
    },

    isFunction(data) {
        return this.isPrototype(data) === '[object function]'
    },

    isString(data) {
        return this.isPrototype(data) === '[object string]'
    },

    isNumber(data) {
        return this.isPrototype(data) === '[object number]'
    },

    isUndefined(data) {
        return this.isPrototype(data) === '[object undefined]'
    },

    isNull(data) {
        return this.isPrototype(data) === '[object null]'
    },

    requiredCheck(...args) {
        for (let v of args) {
            if (this.isNull(v) || this.isUndefined(v) || (this.isNumber(v) && !Number.isFinite(v))) {
                return false
            }
        }
        return true;
    },

    isEmpty(data) {
        if (this.isNull(data) || this.isUndefined(data)) {
            return true
        } else if (this.isString(data)) {
            return data.trim().length === 0
        } else if (this.isNumber(data)) {
            return !Number.isFinite(data)
        } else {
            return Object.keys(data).length === 0
        }
    },

    async curl(url = '', method = 'get', data = {}) {

        if (this.isEmpty(url)) return false;

        method = method.toLowerCase();
        if (method === 'get' && !this.isEmpty(data)) {
            url = url + '?' + querystring.stringify(data);
            data = {};
        }

        try {
            let res = await axios({ method, url, data });
            if (res.status === 200) {
                return res.data
            } else {
                console.log('404');
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    checkIfEmptyAndSetDefault(data, defaultValue = "") {
        if (this.isEmpty(data)) {
            return defaultValue
        }
        return data
    },

};