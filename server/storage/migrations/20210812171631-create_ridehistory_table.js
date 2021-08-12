'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('ridehistory', {
            ridehistoryid: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
            carmasterid: { type: Sequelize.BIGINT, allowNull: false },
            pickup_longitude: { type: Sequelize.STRING, allowNull: false },
            pickup_latitude: { type: Sequelize.STRING, allowNull: false },
            drop_longitude: { type: Sequelize.STRING, allowNull: false },
            drop_latitude: { type: Sequelize.STRING, allowNull: false },
            rideamount: { type: Sequelize.BIGINT, allowNull: false },
            bookingotp: { type: Sequelize.STRING, allowNull: false, unique: true },
            status: { type: Sequelize.STRING, allowNull: false },
            usermasterid: { type: Sequelize.BIGINT, allowNull: false },
            createdby: { type: Sequelize.STRING, allowNull: false },
            createddate: { type: Sequelize.DATE, allowNull: false },
            lastmodifiedby: { type: Sequelize.STRING, allowNull: true },
            lastmodifieddate: { type: Sequelize.DATE, allowNull: true },
            isactive: { type: Sequelize.BOOLEAN, allowNull: false },
        })
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('ridehistory');
    }
};