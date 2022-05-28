const bcrypt = require('bcryptjs');
const util = require('util');
const db = require('_helpers/db');
const config = require('config.json');
const teamService = require('../Teams/team.service');

module.exports = {
    getFreeAgents,
    getTeamPlayers,
    createLeaguePlayers,    
    getPlayer
};
/**
 * getFreeAgents:
 * @param  {} leagueId
 */
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
/**
 * getTeamPlayers:
 * @param  {} leagueId
 * @param  {} teamId
 */
async function getTeamPlayers(leagueId, teamId) {
    return await db.Player.findAll({
        where: 
            {leagueId: leagueId, 
            teamId: teamId},
        order: [
            ['score', 'DESC'],
            ['grade', 'DESC'],
            ['player', 'ASC']
        ]   
    });
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
 * createLeaguePlayers: creating the players of the league
 * @param  {} leagueId
 */
async function createLeaguePlayers(leagueId) {
    //Validate players do not already exist for league
    if (await isPlayersInLeague(leagueId))
        throw 'league already has players'
    
    const {maxPlayerValue} = config.teamBudget;
  
    //call data base stored procudure to create players for the league
    const connection = await db.getDBConn();
    const query = `CALL spCreateLeaguePlayers(?,?)`

    console.log('query=' + query + ' leagueId:'+leagueId+' maxPlayerValue:'+maxPlayerValue);
    
    await connection.query(query, [leagueId, maxPlayerValue],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
    });
} 
/**
 * getPlayer: get player by id
 * @param  {} id
 */
async function getPlayer(id) {
    const player = await db.Player.findByPk(id);
    if (!player) throw 'player not found';
    return player;
}

