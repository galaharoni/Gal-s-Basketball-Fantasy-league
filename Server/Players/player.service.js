const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

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
            teamId: null}   
    });
}

async function getTeamPlayers(leagueId, teamId) {
    return await db.Player.findAll({
        where: 
            {leagueId: leagueId, 
            teamId: teamId}   
    });
}



async function createLeaguePlayers(leagueId) {
    //TODO: validate players do not already exist for league
    //(select value from reference_table where key=\'current_date\') as current_date
    let currentDate = '2021-05-05'
    let connection = await db.getDBConn();
    let query = 'INSERT INTO players \
    (player, playerId,avgRebounds,avgAssists,avgSteals,avgBlocks,avgTurnovers,avgPoints,leagueId,createdAt,updatedAt) \
    SELECT player, playerId, avg(rebound), avg(assists), avg(steals), avg(block), avg(turnover), avg(points), ?, CURDATE(), CURDATE() \
    FROM nba_raw_data \
    where gameDate <  ? \
    group by player,playerId'

    await connection.query(query, [leagueId, currentDate],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
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

// helper functions

async function getPlayer(id) {
    const player = await db.Player.findByPk(id);
    if (!player) throw 'player not found';
    return player;
}
