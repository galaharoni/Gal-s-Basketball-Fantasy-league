const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {

        player:  { type: DataTypes.STRING, allowNull: true },
        playerId:  { type: DataTypes.STRING, allowNull: true },
        avgRebounds:  { type: DataTypes.DOUBLE, allowNull: true },
        avgAssists:  { type: DataTypes.DOUBLE, allowNull: true },
        avgSteals:  { type: DataTypes.DOUBLE, allowNull: true },
        avgBlocks:  { type: DataTypes.DOUBLE, allowNull: true },
        avgTurnovers:  { type: DataTypes.DOUBLE, allowNull: true },
        avgPoints:  { type: DataTypes.DOUBLE, allowNull: true },   
        grade:  { type: DataTypes.DOUBLE, allowNull: true },
        worth:  { type: DataTypes.DOUBLE, allowNull: true }
    };
    const options = {
        defaultScope: {
            // all fields
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Player', attributes, options);
}