var multer  = require('multer');
var storage = multer.memoryStorage();

module.exports.upload = multer({storage: storage});