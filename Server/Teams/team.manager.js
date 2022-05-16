const db = require('_helpers/db');
const LeagueMode = require('_helpers/leagueMode');
const leagueService = require('../Leagues/league.service');
const teamService = require('./team.service');

module.exports = {
    joinLeague
};

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

