var express = require('express');
var api     = require('../modules/api');
var upload  = require('../modules/fileUploader').upload;
var router  = express.Router();

router.get('/', api.getRootFolder, api.getList);
router.post('/', api.create);
router.post('/:bookId(\\d+)', api.update);
router.delete('/:bookId(\\d+)', api.delete);
router.post('/upload', upload.single('csvFile'), api.parseFile);

module.exports = router;