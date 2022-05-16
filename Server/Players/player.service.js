const bcrypt = require('bcryptjs');
const util = require('util');
const db = require('_helpers/db');
//const { makeDb } = require('mysql-async-simple');
const gameDateService = require('../GameDates/gameDate.service');

module.exports = {
    getFreeAgents,
    getTeamPlayers,
    createLeaguePlayers,
    addPlayer,
    removePlayer
};

async function getFreeAgents(leagueId) {
    return await db.Player.findAll({
        where: 
            {leagueId: leagueId, 
            teamId: null},
        order: [
            ['grade', 'DESC'],
            ['player', 'ASC']
        ]
    });
}

async function getTeamPlayers(leagueId, teamId) {
    return await db.Player.findAll({
        where: 
            {leagueId: leagueId, 
            teamId: teamId},
        order: [
            ['grade', 'DESC'],
            ['player', 'ASC']
        ]   
    });
}

async function addPlayer(id, teamId) {
    const player = await getPlayer(id);
    if (player.teamId != null)
        throw 'player is not a free agent'

    player.teamId = teamId;
    await player.save();
}

async function removePlayer(id, teamId) {
    const player = await getPlayer(id);
    if (player.teamId != teamId || player.teamId == null)
        throw 'player is not in the team'

    player.teamId = null;
    await player.save();
}

/*
 * helper functions
 */ 

/**
 * isPlayersInLeague
 * check if league has players
 * @param  {} leagueId
 */
async function isPlayersInLeague(leagueId){
    const player = await db.Player.findOne({
        where: 
            {leagueId: leagueId}   
    });

    if (player != null)
        return true;

    return false;
}
/**
 * addPlayers
 * add players to league with avarage value for each parameter of the game
 * @param  {} leagueId
 */
async function addPlayers(leagueId){
    const gameDate = await gameDateService.getById(1);    
    console.log('gameDateService:'+gameDate.currentDate)

    let currentDateStr = gameDate.currentDate.toISOString().split('T')[0];
    let connection = await db.getDBConn();
    let query = 'INSERT INTO players \
    (player, playerId,avgRebounds,avgAssists,avgSteals,avgBlocks,avgTurnovers,avgPoints,leagueId,createdAt,updatedAt) \
    SELECT player, playerId, avg(rebound), avg(assists), avg(steals), avg(block), avg(turnover), avg(points), ?, CURDATE(), CURDATE() \
    FROM nba_raw_data \
    where gameDate <  ? \
    group by player,playerId'

    console.log(query);

    await connection.query(query, [leagueId, currentDateStr],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
    });    
}
/**
 * setPlayersGrade
 * calculate grades of players according to their performace in all games prior current date
 * @param  {} leagueId
 */
async function setPlayersGrade(leagueId){
    let connection = await db.getDBConn();
    let queryTxt = 'update players, \
            (select playerId, sum(rebound+assists+steals+block-turnover+1.1*points) as grade \
            from nba_raw_data \
            where gameDate < \
                (SELECT currentDate \
                FROM gamedates limit 1) \
            group by playerId \
                ) as stats \
        set players.grade = stats.grade \
        where players.playerId = stats.playerId \
        and players.leagueId = ' + leagueId;   
    
    console.log('3 setPlayersGrade:'+queryTxt);

    // node native promisify
    const query = util.promisify(connection.query).bind(connection);    
    (async () => {
        try {
          const rows = await query(queryTxt);
          console.log(rows);
        } finally {
            connection.end();
        }
      })()

    console.log('4. done setPlayersGrade');
}

async function setPlayersWorth(leagueId){
    let connection = await db.getDBConn();
    let query = 'select max(grade) as maxGrade from players where leagueId =' + leagueId;

    console.log(query);

    await connection.query(query, (err, rows) => {
        if(err) throw err; 
        console.log('setPlayersWorth:' + rows[0]);
    });    
}

/*
async function createLeaguePlayers(leagueId) {
    //Validate players do not already exist for league
    if (await isPlayersInLeague(leagueId))
        throw 'league already has players'
    
    console.log('1.before addPlayers')
    await addPlayers(leagueId);
    console.log('2.before setPlayersGrade')
    await setPlayersGrade(leagueId).then(res =>{
        console.log('5. after setPlayersGrade')    
    });
    await setPlayersWorth(leagueId).then(res =>{
        console.log('6. after setPlayersWorth')    
    });;
    console.log('7. done createLeaguePlayers')
}*/

async function createLeaguePlayers(leagueId) {
    //Validate players do not already exist for league
    if (await isPlayersInLeague(leagueId))
        throw 'league already has players'
  
    let connection = await db.getDBConn();
    let query = `CALL spCreateLeaguePlayers(?)`

    console.log(query);

    await connection.query(query, [leagueId],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
    });
} 

async function getPlayer(id) {
    const player = await db.Player.findByPk(id);
    if (!player) throw 'player not found';
    return player;
}
