const Router = require("koa-router");
const util = require("../common/util");
const core = require("../common/core");
const service = require("../controller/service");

const router = new Router();
router.use(core.corsSet);
router.use(core.preDataFilter);
router.post("/wallet/getTransions", service.getTransions);
router.post("/wallet/getTokenBalance", service.getTokenBalance);
router.post("/wallet/getEthBalance", service.getEthBalance);
router.post("/wallet/getGasPrice", service.getGasPrice);

router.all("/*", (ctx) => (ctx.response.body = util.failResponse("E2003")));

module.exports = router;
