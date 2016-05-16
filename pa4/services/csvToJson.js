var Converter = require("csvtojson").Converter;
var converter = new Converter({
    noheader: true,
    headers: ['url', 'folderId', 'name', 'description', 'keywords', 'favorite', 'folder'],
    maxRowLength: '2000',
    checkColumn: true
});

function parseCSVFile(buffer, onNewRecord, handleError, done) {
    var source = String.fromCharCode.apply(null, buffer);

    converter.fromString(source, function (err, result) {
        if (err)
        {
            handleError(err)
        }

        onNewRecord(result);
        done();
    });
}

module.exports.parseCSVFile = parseCSVFile;
module.exports.converter = converter;