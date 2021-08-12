'use strict';
module.exports = function(sequelize, DataTypes) {
    const carmaster = sequelize.define('carmaster', {
        carmasterid: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        carno: { type: DataTypes.STRING, allowNull: false },
        longitude: { type: DataTypes.STRING, allowNull: false },
        latitude: { type: DataTypes.STRING, allowNull: false },
        usermasterid: { type: DataTypes.BIGINT, allowNull: false },
        ridestatus: { type: DataTypes.STRING, allowNull: false },
        createdby: { type: DataTypes.STRING, allowNull: false },
        createddate: { type: DataTypes.DATE, allowNull: false },
        lastmodifiedby: { type: DataTypes.STRING, allowNull: true },
        lastmodifieddate: { type: DataTypes.DATE, allowNull: true },
        isactive: { type: DataTypes.BOOLEAN, allowNull: false },

    }, {
        timestamps: false,
        freezeTableName: true
    });
    carmaster.associate = function(models) {
        carmaster.belongsTo(models.usermaster, {
                foreignKey: 'usermasterid',
                targetKey: 'usermasterid'
            }),
            carmaster.belongsTo(models.ridehistory, {
                foreignKey: 'carmasterid',
                targetKey: 'carmasterid'
            })
    }
    carmaster.removeAttribute('id');
    return carmaster;
}