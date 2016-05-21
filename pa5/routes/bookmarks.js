var express   = require('express');
var bookmarks = require('../modules/bookmarks');
var upload      = require('../modules/fileUploader').upload;
var router    = express.Router();

router.get('/', bookmarks.list);
router.post('/', bookmarks.add);
router.post('/folder', bookmarks.addFolder);
router.post('/edit/:bookId(\\d+)', bookmarks.edit);
router.post('/delete/:bookId(\\d+)', bookmarks.edit);
router.get('/confirm-delete', bookmarks.confirmDelete);
router.post('/insert', bookmarks.insert);

router.get('/editfolder', bookmarks.showEditFolder);
router.get('/createfolder', bookmarks.createFolder);
router.post('/insertFolder', bookmarks.insertFolder);
router.get('/create', bookmarks.create);

router.get('/favorite', bookmarks.favorite);
router.post('/editbookmark', bookmarks.editBookmark);

router.get('/editbookmark', bookmarks.editBookmark);
router.get('/upload-dialog', bookmarks.uploadDialog);
router.post('/upload', upload.single('csvFile'), bookmarks.parseFile);
router.get('/download', bookmarks.getBookmarks, bookmarks.getCSV);

router.post('/search', bookmarks.search);
router.post('/sort', bookmarks.sort);
router.get('/home', bookmarks.home);

module.exports = router;