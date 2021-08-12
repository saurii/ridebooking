'use strict';
module.exports = function(sequelize, DataTypes) {
    const usermaster = sequelize.define('usermaster', {
        usermasterid: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        roleid: { type: DataTypes.BIGINT, allowNull: false },
        mobileno: { type: DataTypes.STRING, allowNull: false },
        emailaddress: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        createdby: { type: DataTypes.STRING, allowNull: false },
        createddate: { type: DataTypes.DATE, allowNull: false },
        lastmodifiedby: { type: DataTypes.STRING, allowNull: true },
        lastmodifieddate: { type: DataTypes.DATE, allowNull: true },
        isactive: { type: DataTypes.BOOLEAN, allowNull: false },

    }, {
        timestamps: false,
        freezeTableName: true
    });
    usermaster.associate = function(models) {
        usermaster.belongsTo(models.rolemaster, {
                foreignKey: 'roleid',
                targetKey: 'roleid'
            }),
            usermaster.belongsTo(models.carmaster, {
                foreignKey: 'usermasterid',
                targetKey: 'usermasterid'
            }),
            usermaster.belongsTo(models.ridehistory, {
                foreignKey: 'usermasterid',
                targetKey: 'usermasterid'
            })
    }
    usermaster.removeAttribute('id');
    return usermaster;
}