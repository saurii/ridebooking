'use strict';
module.exports = function(sequelize, DataTypes) {
    const rolemaster = sequelize.define('rolemaster', {
        roleid: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        rolename: { type: DataTypes.STRING, allowNull: false, unique: true },
        createdby: { type: DataTypes.STRING, allowNull: false },
        createddate: { type: DataTypes.DATE, allowNull: false },
        lastmodifiedby: { type: DataTypes.STRING, allowNull: true },
        lastmodifieddate: { type: DataTypes.DATE, allowNull: true },
        isactive: { type: DataTypes.BOOLEAN, allowNull: false },

    }, {
        timestamps: false,
        freezeTableName: true
    });
    rolemaster.associate = function(models) {
        rolemaster.belongsTo(models.usermaster, {
            foreignKey: 'roleid',
            targetKey: 'roleid'
        })
    }
    rolemaster.removeAttribute('id');
    return rolemaster;
}