const fs = require('fs');
const path = require('path');
let config = fs.readFileSync(path.resolve(__dirname, './config.json'), 'utf8');
module.exports = JSON.parse(config);