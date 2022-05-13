const { DataTypes } = require('sequelize');

module.exports = model;


function model(sequelize) {
    const attributes = {
        draftPick: { type: DataTypes.INTEGER, allowNull: true },
        budget:  { type: DataTypes.INTEGER, allowNull: true }
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
