const { DataTypes } = require('sequelize');

module.exports = model;
/**
 * model: league model
 * defindes the attributes of the model
 * @param  {} sequelize
 */
function model(sequelize) {
    const attributes = {
        leagueName: { type: DataTypes.STRING, allowNull: false },
        rounds: { type: DataTypes.INTEGER, allowNull: false },
        currentRound: { type: DataTypes.INTEGER, allowNull: true },
        teamsCount: { type: DataTypes.INTEGER, allowNull: false },
        leagueMode: { type: DataTypes.STRING, allowNull: false },
        pickingTeam: { type: DataTypes.INTEGER, allowNull: true }
    };

    const options = {
        defaultScope: {
            // all fields
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('League', attributes, options);
}