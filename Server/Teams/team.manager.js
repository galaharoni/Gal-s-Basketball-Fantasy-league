const db = require('_helpers/db');
const LeagueMode = require('_helpers/leagueMode');
const leagueService = require('../Leagues/league.service');
const teamService = require('./team.service');

module.exports = {
    joinLeague,
    setPlaces
};
/**
 * joinLeague: create league in team
 * @param  {} leagueId
 * @param  {} accountId
 */
async function joinLeague(leagueId, accountId) {
    // Validate same account not added to a league again
    if (await db.Team.findOne({ where: { leagueId: leagueId, accountId:accountId} })) {
        throw 'Owner ' + accountId + ' already has a team in league ' + leagueId;
    }

    // Validate number of teams does not exceed max teams
    const currentTeamsCount = await teamService.getTeamsCount(leagueId);
    const league = await leagueService.getById(leagueId);
    
    if (currentTeamsCount >= league.teamsCount)
        throw 'League ' + leagueId + ' already has the max teams count: ' + league.teamsCount;

    await teamService.create(leagueId, accountId);

    // when adding the last team, change status to draft and create players
    if (currentTeamsCount == league.teamsCount-1) {
        league.leagueMode = LeagueMode.Draft;
        league.save();   
        await leagueService.setDraft(league);
    }    
}
/**
 * setPlaces: set team places in the league
 * @param  {} leagueId
 */
async function setPlaces(leagueId) {
    //Set pick
    //get running leagues
    const leagues = await leagueService.getRunningLeagues();
    
    const unresolvedLeagues = leagues.map(async(league)=> {
            //for each league set teams places
            console.log('setPlaces league id:' + league.id);
            const teams = await teamService.getByLeague(league.id);
            const unresolvedTeams = teams.map(async (team, idx) => {
                    console.log('setPlaces id:' + team.id + ' place:' + idx+1);
                    team.place = idx+1;
                    await team.save();
                }
            )
            const resolvedTeams = await Promise.all(unresolvedTeams);
    })
    const resolvedLeagues = await Promise.all(unresolvedLeagues);
}    