const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const LeagueMode = require('_helpers/leagueMode');
const leagueService = require('../Leagues/league.service');

module.exports = {
    getAll,
    getById,
    getByLeague,
    getByAccount,
    create,
    update,
    delete: _delete,
    joinLeague,
    getByLeagueNaccount
};

async function joinLeague(leagueId, accountId) {
    // Validate same account not added to a league again
    if (await db.Team.findOne({ where: { leagueId: leagueId, accountId:accountId} })) {
        throw 'Owner ' + accountId + ' already has a team in league ' + leagueId;
    }

    // Validate number of teams does not exceed max teams
    let currentTeamsCount = await getTeamsCount(leagueId);
    const league = await leagueService.getById(leagueId);
    
    if (currentTeamsCount >= league.teamsCount)
        throw 'League ' + leagueId + ' already has the max teams count: ' + league.teamsCount;

    const team = new db.Team();
    team.leagueId = leagueId;
    team.accountId = accountId; 

    // save team
    await team.save();

    // when adding the last team, change status to draft and create players
    if (currentTeamsCount == league.teamsCount-1) {
        league.leagueMode = LeagueMode.Draft;
        league.save();   
        leagueService.setDraft(leagueId);
    }    
}

async function getTeamsCount(leagueId) {
    // connect to db
    const results = await db.Team.findAll({
        where: {
            leagueId: leagueId
          }
      });
    
    console.log('getTeamsCount league ' + leagueId + ' count: ' + results.length);
    return results.length;
}

async function getByLeagueNaccount(leagueId, accountId) {
    return await db.Team.findAll({
        where: 
            {leagueId: leagueId, 
            accountId: accountId},
        include: [db.Account]    
    });
}

async function getByLeague(leagueId) {
    return await db.Team.findAll({
        where: {leagueId: leagueId},
        include: [db.Account]    
    });
}

async function getByAccount(accountId) {
    return await db.Team.findAll({
        where: {accountId: accountId},
        include: [db.League]    
    });
}

async function getAll() {
    return await db.Team.findAll();
}

async function getById(id) {
    return await getTeam(id);
}

async function create(req) {
    // validate
    
    params = req.body;
    


    const team = new db.Team(params);
    
    // Teams
    //TODO: limit teams by number of players / 10

    // save team
    await team.save();
}

async function update(id, params) {
    const team = await getTeam(id);

    // validate
    // TODO: validate same account not added to a league again
    /*
    const teamNameChanged = params.teamName && team.teamName !== params.teamName;
    if (teamNameChanged && await db.LeaguePlayer.findOne({ where: { teamName: params.teamName } })) {
        throw 'League Name "' + params.teamName + '" is already registered';
    }*/

    // Teams
    //TODO: limit teams by number of players / 10

    // copy params to league Player player and save
    Object.assign(team, params);
    await team.save();
}

async function _delete(id) {
    const user = await getTeam(id);
    await user.destroy();
}

// helper functions

async function getTeam(id) {
    const team = await db.Team.findByPk(id);
    if (!team) throw 'Team not found';
    return team;
}
