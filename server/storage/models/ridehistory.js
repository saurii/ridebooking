'use strict';
module.exports = function(sequelize, DataTypes) {
    const ridehistory = sequelize.define('ridehistory', {
        ridehistoryid: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        carmasterid: { type: DataTypes.BIGINT, allowNull: false },
        pickup_longitude: { type: DataTypes.STRING, allowNull: false },
        pickup_latitude: { type: DataTypes.STRING, allowNull: false },
        drop_longitude: { type: DataTypes.STRING, allowNull: false },
        drop_latitude: { type: DataTypes.STRING, allowNull: false },
        rideamount: { type: DataTypes.BIGINT, allowNull: false },
        bookingotp: { type: DataTypes.STRING, allowNull: false, unique: true },
        status: { type: DataTypes.STRING, allowNull: false },
        usermasterid: { type: DataTypes.BIGINT, allowNull: false },
        createdby: { type: DataTypes.STRING, allowNull: false },
        createddate: { type: DataTypes.DATE, allowNull: false },
        lastmodifiedby: { type: DataTypes.STRING, allowNull: true },
        lastmodifieddate: { type: DataTypes.DATE, allowNull: true },
        isactive: { type: DataTypes.BOOLEAN, allowNull: false },

    }, {
        timestamps: false,
        freezeTableName: true
    });
    ridehistory.associate = function(models) {
        ridehistory.belongsTo(models.usermaster, {
                foreignKey: 'usermasterid',
                targetKey: 'usermasterid'
            }),
            ridehistory.belongsTo(models.carmaster, {
                foreignKey: 'carmasterid',
                targetKey: 'carmasterid'
            })
    }
    ridehistory.removeAttribute('id');
    return ridehistory;
}