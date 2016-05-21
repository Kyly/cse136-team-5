var handlebars = require('express-handlebars');
module.exports = handlebars(
    {
        extname: '.hbs',
        helpers: {
            toJSON: function (object) {
                return JSON.stringify(object);
            }
        }
    }
);