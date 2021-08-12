'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('rolemaster', [{
            rolename: 'admin',
            createddate: new Date(),
            createdby: 'admin@ride.com',
            isactive: true
        }, {
            rolename: 'user',
            createddate: new Date(),
            createdby: 'admin@ride.com',
            isactive: true
        }, {
            rolename: 'driver',
            createddate: new Date(),
            createdby: 'admin@ride.com',
            isactive: true
        }], {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('rolemaster', null, {});
    }
};