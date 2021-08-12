'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('carmaster', {
            carmasterid: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
            carno: { type: Sequelize.STRING, allowNull: false, unique: true },
            longitude: { type: Sequelize.STRING, allowNull: false },
            latitude: { type: Sequelize.STRING, allowNull: false },
            usermasterid: { type: Sequelize.BIGINT, allowNull: false },
            ridestatus: { type: Sequelize.STRING, allowNull: false },
            createdby: { type: Sequelize.STRING, allowNull: false },
            createddate: { type: Sequelize.DATE, allowNull: false },
            lastmodifiedby: { type: Sequelize.STRING, allowNull: true },
            lastmodifieddate: { type: Sequelize.DATE, allowNull: true },
            isactive: { type: Sequelize.BOOLEAN, allowNull: false },
        })

        await queryInterface.addIndex('carmaster', ['carno']);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('carmaster');
    }
};