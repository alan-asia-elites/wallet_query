let crypto = require('crypto');
let secret = 'PrimtiveOfWarSecret';
let passwordSecret = 'PrimtiveOfWarPasswordSecret';
let expire = 2 * 60 * 60 * 1000; // default expire time: 2 hours

/**
 * Create token by uid. Encrypt uid and timestamp to get a token.
 * 
 * @param {String} uid user id
 * @param {String|Number} timestamp
 * @return {String} token string
 */
module.exports.create = function(account, timestamp) {
    let msg = account + '|' + timestamp;
    let cipher = crypto.createCipher('aes256', secret);
    let enc = cipher.update(msg, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
};

/**
 * Parse token to validate it and get the uid and timestamp.
 * 
 * @param {String} token token string
 * @return {Object} uid and timestamp that exported from token. null for illegal token.
 */
module.exports.parse = function(token) {
    let decipher = crypto.createDecipher('aes256', secret);
    let dec;
	try {
		dec = decipher.update(token, 'hex', 'utf8');
		dec += decipher.final('utf8');
	} catch (err) {
		console.error('[token] fail to decrypt token. %j', token);
		return null;
	}
    let ts = dec.split('|');
	if (ts.length !== 2) {
		// illegal token
		return null;
	}
	return {
		account : ts[0],
		timestamp : Number(ts[1])
	};
};

/**
 * Is a token expired.
 * 
 * @param {Number} token's timestamp
 * @return {Boolean} whether the token expired.
 */
module.exports.expired = function(timestamp) {
	if (expire < 0) {
		// negative expire means never expire
		return true;
	}
	return (Date.now() - timestamp) > expire;
};