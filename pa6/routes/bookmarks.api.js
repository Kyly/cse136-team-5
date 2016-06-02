var express = require('express');
var api     = require('../modules/api');
var upload  = require('../modules/fileUploader').upload;
var router  = express.Router();

router.get('/', api.getRootFolder, api.getList);
router.get('/folders', api.getFolders);
router.post('/', api.createBookmarkPerm, api.create);
router.post('/:bookId(\\d+)', api.update);
router.delete('/:bookId(\\d+)', api.delete);
router.post('/upload', upload.single('file'), api.getRootFolder, api.parseFile);

module.exports = router;