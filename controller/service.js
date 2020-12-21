const util = require("../common/util");
const { logger } = require("../log/logger_config");
const config = require("../config/config");

const failResonse = { status: "0" };

class Service {

    static async getTransions(ctx) {
        let token = ctx.request.data.token;
        let address = ctx.request.data.address;
        let contractaddress = ctx.request.data.contractaddress;
        let startblock = ctx.request.data.startBlock;
        let page = ctx.request.data.page;
        let type = ctx.request.data.type;
        let offset = ctx.request.data.offset;
        let sort = ctx.request.data.sort;

        // check params
		if (!util.requiredCheck(address)) {
			ctx.body = failResonse;
			return;
		}
        
        contractaddress = util.checkIfEmptyAndSetDefault(contractaddress, config.TEST_USDT_CONTACT_ADDRESS);
        startblock = util.checkIfEmptyAndSetDefault(startblock, "0");
        page = util.checkIfEmptyAndSetDefault(page, "1");
        offset = util.checkIfEmptyAndSetDefault(offset, "100");
        type = util.checkIfEmptyAndSetDefault(type, "0");
        sort = util.checkIfEmptyAndSetDefault(sort, "aes");

        if (type == "1") {
            let url = "https://api.etherscan.io/api";
            let params = {
                module: "account",
                action: "tokentx",
                contractaddress: config.USDT_CONTACT_ADDRESS,
                address,
                page,
                offset,
                sort,
                apikey: config.ETHERSCAN_API_KEY,
                startblock,
                endblock: 999999999
            };
            logger.info("getTransions url: ", url)
            logger.info("getTransions params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getTransions response: ", JSON.stringify(response));
                if (response) {
                    ctx.body = response;
                    return;
                }

            } catch(e) {
                logger.info("getTransions error: ", e.toString());
            }
        } else {
            let url = "https://api-rinkeby.etherscan.io/api";
            let params = {
                module: "account",
                action: "tokentx",
                contractaddress,
                address,
                page,
                offset,
                sort,
                apikey: config.ETHERSCAN_API_KEY,
                startblock,
                endblock: 999999999
            };
            logger.info("getTransions url: ", url)
            logger.info("getTransions params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getTransions response: ", JSON.stringify(response))
                if (response) {
                    ctx.body = response;
                    return;
                } else {
                    logger.info("getTransions error");
                }

            } catch(e) {
                logger.info("getTransions error: ", e.toString());
            }
        }
        ctx.body = failResonse;
    }

    static async getTokenBalance(ctx) {
        let type = ctx.request.data.type;
        let address = ctx.request.data.address;
        let contractaddress = ctx.request.data.contractaddress;

        // check params
		if (!util.requiredCheck(address)) {
			ctx.body = failResonse;
			return;
        }
        contractaddress = util.checkIfEmptyAndSetDefault(contractaddress, config.TEST_USDT_CONTACT_ADDRESS);
        
        if (type == "1") {
            let url = "https://api.etherscan.io/api";
            let params = {
                module: "account",
                action: "tokenbalance",
                tag: "latest",
                contractaddress: config.USDT_CONTACT_ADDRESS,
                address,
                apikey: config.ETHERSCAN_API_KEY
            };
            logger.info("getTokenBalance url: ", url)
            logger.info("getTokenBalance params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getTokenBalance response: ", JSON.stringify(response));
                if (response) {
                    ctx.body = response;
                    return;
                }

            } catch(e) {
                logger.info("getTokenBalance error: ", e.toString());
            }
        } else {
            let url = "https://api-rinkeby.etherscan.io/api";
            let params = {
                module: "account",
                action: "tokenbalance",
                contractaddress: contractaddress,
                tag: "latest",
                address,
                apikey: config.ETHERSCAN_API_KEY
            };
            logger.info("getTokenBalance url: ", url)
            logger.info("getTokenBalance params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getTokenBalance response: ", JSON.stringify(response));
                if (response) {
                    ctx.body = JSON.stringify(response);
                    return;
                } else {
                    logger.info("getTokenBalance error");
                }

            } catch(e) {
                logger.info("getTokenBalance error: ", e.toString());
            }
        }
        ctx.body = failResonse;

    }

    static async getEthBalance(ctx) {
        let type = ctx.request.data.type;
        let address = ctx.request.data.address;

        // check params
		if (!util.requiredCheck(address)) {
			ctx.body = failResonse;
			return;
        }
        
        if (type == "1") {
            let url = "https://api.etherscan.io/api";
            let params = {
                module: "account",
                action: "balance",
                tag: "latest",
                address,
                apikey: config.ETHERSCAN_API_KEY
            };
            logger.info("getEthBalance url: ", url)
            logger.info("getEthBalance params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getEthBalance response: ", JSON.stringify(response));
                if (response) {
                    ctx.body = JSON.stringify(response);
                    return;
                }

            } catch(e) {
                logger.info("getTokenBalance error: ", e.toString());
            }
        } else {
            let url = "https://api-rinkeby.etherscan.io/api";
            let params = {
                module: "account",
                action: "balance",
                tag: "latest",
                address,
                apikey: config.ETHERSCAN_API_KEY
            };
            logger.info("getEthBalance url: ", url)
            logger.info("getEthBalance params: ", JSON.stringify(params))
            try {
                let response = await util.curl(url, "get", params);
                logger.info("getEthBalance response: ", JSON.stringify(response))
                if (response) {
                    ctx.body = JSON.stringify(response);
                    return;
                } else {
                    logger.info("getEthBalance error");
                }

            } catch(e) {
                logger.info("getEthBalance error: ", e.toString());
            }
        }
        ctx.body = failResonse;
    }
    static async getGasPrice(ctx) {
        let url = "https://ethgasstation.info/api/ethgasAPI.json?api-key=efd16fb3a1739f5e8dfb57ad96b00f41771217c76f453995b5eae53da6a0";
        logger.info("getGasPrice url: ", url)
        try {
            let response = await util.curl(url);
            logger.info("getGasPrice response: ", JSON.stringify(response))
            if (response) {
                ctx.body = JSON.stringify(response);
                return;
            }
        } catch(e) {
            logger.info("getTokenBalance error: ", e.toString());
        }
        ctx.body = failResonse;
    }

}

module.exports = Service;
