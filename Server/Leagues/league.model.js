const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        leagueName: { type: DataTypes.STRING, allowNull: false },
        rounds: { type: DataTypes.INTEGER, allowNull: false },
        teamsCount: { type: DataTypes.INTEGER, allowNull: false },
        substitutionCycle: { type: DataTypes.INTEGER, allowNull: false },
        leagueCode: { type: DataTypes.STRING, allowNull: true },
        publicLeague: { type: DataTypes.BOOLEAN, allowNull: false },
        leagueMode: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            // all fields
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('League', attributes, options);
}