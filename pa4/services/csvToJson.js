var Converter = require("csvtojson").Converter;
var converter = new Converter({
    noheader: true,
    headers: ['url', 'folderId', 'name', 'description', 'keywords', 'favorite', 'folder'],
    maxRowLength: '2000',
    checkColumn: true
});

module.exports = converter;