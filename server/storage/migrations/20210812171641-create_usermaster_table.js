'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('usermaster', {
            usermasterid: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
            name: { type: Sequelize.STRING, allowNull: false },
            roleid: { type: Sequelize.BIGINT, allowNull: false },
            mobileno: { type: Sequelize.STRING, allowNull: false, unique: true },
            emailaddress: { type: Sequelize.STRING, allowNull: false, unique: true },
            address: { type: Sequelize.STRING, allowNull: true },
            password: { type: Sequelize.STRING, allowNull: false },
            createdby: { type: Sequelize.STRING, allowNull: false },
            createddate: { type: Sequelize.DATE, allowNull: false },
            lastmodifiedby: { type: Sequelize.STRING, allowNull: true },
            lastmodifieddate: { type: Sequelize.DATE, allowNull: true },
            isactive: { type: Sequelize.BOOLEAN, allowNull: false },
        })

        await queryInterface.addIndex('usermaster', ['emailaddress', 'mobileno']);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('usermaster');
    }
};