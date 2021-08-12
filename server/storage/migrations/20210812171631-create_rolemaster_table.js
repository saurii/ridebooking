'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('rolemaster', {
            roleid: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
            rolename: { type: Sequelize.STRING, allowNull: false, unique: true },
            createdby: { type: Sequelize.STRING, allowNull: false },
            createddate: { type: Sequelize.DATE, allowNull: false },
            lastmodifiedby: { type: Sequelize.STRING, allowNull: true },
            lastmodifieddate: { type: Sequelize.DATE, allowNull: true },
            isactive: { type: Sequelize.BOOLEAN, allowNull: false }
        })

        await queryInterface.addIndex('rolemaster', ['rolename']);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('rolemaster');
    }
};