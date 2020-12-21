const AES = require('crypto');
const RSA = require('node-rsa');

module.exports = {

    encodeAES(content, key) {
        var iv = "";
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var cipher = AES.createCipheriv('aes-256-ecb', key, iv);
        cipher.setAutoPadding(true);

        cipherChunks.push(cipher.update(content, clearEncoding, cipherEncoding));
        cipherChunks.push(cipher.final(cipherEncoding));

        return cipherChunks.join('');
    },

    decodeAES(content, key) {
        var iv = "";
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var decipher = AES.createDecipheriv('aes-256-ecb', key, iv);
        decipher.setAutoPadding(true);

        cipherChunks.push(decipher.update(content, cipherEncoding, clearEncoding));
        cipherChunks.push(decipher.final(clearEncoding));

        return cipherChunks.join('');
    },

    encodeRSA(content, key_pub) {
        var key = getPublicKey(key_pub);
        const rsa = new RSA(key);
        rsa.setOptions({encryptionScheme: 'pkcs1'});
        return rsa.encrypt(content, 'base64');
    },

    decodeRSA(content, key_pri) {
        var key = getPrivateKey(key_pri)
        const rsa = new RSA(key);
        rsa.setOptions({encryptionScheme: 'pkcs1'});
        return rsa.decrypt(content, 'utf8');
    },

    signRSA(content, key_pri) {
        var key = getPrivateKey(key_pri)
        const rsa = new RSA();
        rsa.setOptions({encryptionScheme: 'pkcs1'});
        rsa.setOptions({b: 1024, signingScheme: "pkcs1-sha256"});
        rsa.importKey(key, 'pkcs8-private');
        return rsa.sign(content, "base64", 'utf8');
    },

    validateRSA(content, sign, key_pub) {
        var key = getPublicKey(key_pub)
        const rsa = new RSA(key);
        rsa.setOptions({encryptionScheme: 'pkcs1'});
        return rsa.verify(Buffer.from(content), sign, 'utf8', 'base64')
    }
}

function insertStr(str, insertStr, sn) {
    var newstr = '';
    for (var i = 0; i < str.length; i += sn) {
        var tmp = str.substring(i, i + sn);
        newstr += tmp + insertStr;
    }
    return newstr;
}

const getPrivateKey = function (key) {
    const result = insertStr(key, '\n', 64);
    return '-----BEGIN PRIVATE KEY-----\n' + result + '-----END PRIVATE KEY-----';
};

const getPublicKey = function (key) {
    const result = insertStr(key, '\n', 64);
    return '-----BEGIN PUBLIC KEY-----\n' + result + '-----END PUBLIC KEY-----';
};