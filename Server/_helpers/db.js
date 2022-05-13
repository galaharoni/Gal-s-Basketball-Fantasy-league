const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

let _DBConn;

module.exports = db = {getDBConn};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    _DBConn = connection;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    db.League = require('../Leagues/league.model')(sequelize);
    db.Team = require('../Teams/team.model')(sequelize);
    db.Player = require('../Players/player.model')(sequelize);
    db.gameDate = require('../GameDates/gameDate.model')(sequelize);

    // define relationships
    // one account has many tokens
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // one account has many leagues
    db.Account.hasMany(db.League, {onDelete: 'CASCADE' });
    db.League.belongsTo(db.Account);

    // one account has many teams
    db.Account.hasMany(db.Team, { onDelete: 'CASCADE' });
    db.Team.belongsTo(db.Account);

    // one leagues has many teams
    db.Team.belongsTo(db.League, { foreignKey: 'leagueId'});
    db.League.hasMany(db.Team, { onDelete: 'CASCADE', foreignKey: 'leagueId'});

    // one leagues has many players
    db.Player.belongsTo(db.League, { foreignKey: 'leagueId'});
    db.League.hasMany(db.Player, { onDelete: 'CASCADE',  foreignKey: 'leagueId'});

    // one team has many players
    db.Player.belongsTo(db.Team, { foreignKey: 'teamId'});
    db.Team.hasMany(db.Player, {foreignKey: 'teamId'});

    
    // sync all models with database
    await sequelize.sync();

    const gameDateService = require('../GameDates/gameDate.service');
    gameDateService.create();    
}

async function getDBConn() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password, database});
    _DBConn = connection;

    return _DBConn;
}