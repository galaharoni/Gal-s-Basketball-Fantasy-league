const teamService = require('../Teams/team.service');
const leagueService = require('../Leagues/league.service');
const playerService = require('./player.service');
const config = require('config.json');
const leagueMode = require('../_helpers/leagueMode');

module.exports = {    
    addPlayer,
    removePlayer
};

/**
 * addPlayer: add player to a team
 * checks if the team has the the budget
 * reduce the player's value from team budget
 * @param  {} id
 * @param  {} teamId
 */
async function addPlayer(id, teamId) {

    //check if the player is a free agent
    const player = await playerService.getPlayer(id); 
    if (player.teamId != null)
        throw 'player is not a free agent'
        
    //check if the team has the budget to sign the player
    const team = await teamService.getById(teamId);
        
    if(team.budget < player.worth)
        throw 'not enough budget';

    /*
     * add player to team
     */

    player.teamId = teamId;
    await player.save();

    /*
     * reduce value of the player from the budget
     */

    console.log('reducing budget');

    team.budget -= player.worth;
    await team.save();

    console.log('reduced budget');

    /*
     * If all teams have full roster set League to Run.
     */
    const {teamSize} = config.teamBudget;
    const connection = await db.getDBConn();
    const query = `CALL spRosterFull(?,?)`    

    console.log('query=' + query + ' leagueId:'+player.leagueId+' teamSize:'+teamSize);
    
    await connection.query(query, [player.leagueId, teamSize],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
    });    

    //check if league is in status Run
    const league = leagueService.getById(player.leagueId);
    if (league.mode == leagueMode.Run)
        return;    
    /*
     * Next pick
     */

    await leagueService.nextPick(player.leagueId);
}

/**
 * removePlayer:
 * @param  {} id
 * @param  {} teamId
 */
 async function removePlayer(id, teamId) {
    /*
     * remove player from team
     */
   const player = await getPlayer(id);
   if (player.teamId != teamId || player.teamId == null)
       throw 'player is not in the team'

    const league = await leagueService.getById(player.leagueId);
    if (league.mode!=leagueMode.Draft){
        console.log('removePlayer League is not in Draft mode');    
        throw 'League is not in Draft mode. Please refresh.';
    }

   player.teamId = null;
   await player.save();

    /*
    * add value of the player to the budget
    */
    const team = await teamService.getById(teamId);
    team.budget = team.budget + player.worth;
    await team.save();
}