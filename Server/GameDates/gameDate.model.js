const { DataTypes } = require('sequelize');

module.exports = model;
/**
 * model: game date model
 * defindes the attributes of the model
 * @param  {} sequelize
 */
function model(sequelize) {
    const attributes = {
        currentDate: { type: DataTypes.DATE, allowNull: true },
        endDate: { type: DataTypes.DATE, allowNull: true }
    };

    const options = {
        defaultScope: {
            // all fields
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('GameDate', attributes, options);
}