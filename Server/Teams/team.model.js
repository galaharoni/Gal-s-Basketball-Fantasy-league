const { DataTypes } = require('sequelize');

module.exports = model;

/**
 * model: team model 
 * defindes the attributes of the model
 * @param  {} sequelize
 */
function model(sequelize) {
    const attributes = {
        draftPick: { type: DataTypes.INTEGER, allowNull: true },
        budget:  { type: DataTypes.INTEGER, allowNull: true },
        score:  { type: DataTypes.DOUBLE, allowNull: true },
        place:  { type: DataTypes.INTEGER, defaultValue:9999 }

    };

    const options = {
        defaultScope: {
            // all fields
            withHash: { attributes: {}, }
        }
    };

    _seq = sequelize;
    return sequelize.define('Team', attributes, options);
}
