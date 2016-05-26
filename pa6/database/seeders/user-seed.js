'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [{
            name: 'user',
            password: '$2a$10$R7dXgybgsVYWz9hqDI0U4Oere3RNPqFDpOHfm40vRF4nmUzwd7gIy'
        }, {
            name: 'user2',
            password: '$2a$10$R7dXgybgsVYWz9hqDI0U4Oere3RNPqFDpOHfm40vRF4nmUzwd7gIy'
        }, {
            name: 'user3',
            password: '$2a$10$R7dXgybgsVYWz9hqDI0U4Oere3RNPqFDpOHfm40vRF4nmUzwd7gIy'
        }], {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', {
            name: {$like: 'user%'}
        });
    }
};
