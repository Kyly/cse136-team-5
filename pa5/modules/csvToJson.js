var Converter = require('csvtojson').Converter;
var json2csv = require('json2csv');

var headers = ['name', 'url', 'description', 'keywords', 'favorite'];

function parseCSVFile(buffer, onNewRecord, handleError, done) {
    var source = String.fromCharCode.apply(null, buffer);
    var converter = new Converter({
        noheader: true,
        headers: headers,
        maxRowLength: '2000',
        checkColumn: true
    });

    converter.fromString(source, function (err, result) {
        if (err)
        {
            handleError(err)
        }

        onNewRecord(result);
        done();
    });
}

function parseJsonToCSV(json, handleError, done) {
    // var filteredJson = json.filter((row) => row.name !== 'root');
    json2csv({data: filteredJson, fields: headers}, function (err, csv) {
        if (err) {
            handleError(err);
        }
        
        done(csv);
    });
}

module.exports.parseCSVFile = parseCSVFile;
module.exports.parseJsonToCSV = parseJsonToCSV;