const db = require('_helpers/db');
const config = require('config.json');

module.exports = {
    getAll,
    getById,
    getByLeague,
    getByAccount,
    create,
    update,
    delete: _delete,
    initDraft,
    getByLeagueNaccount,
    getTeamsCount
};

async function setDraftPeak(id, draftPeak) {
    const team = await getTeam(id);
    team.draftPick = draftPeak;
    await team.save();
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

async function create(leagueId, accountId) {
    // Teams
    //TODO: limit teams by number of players / 10
    const team = new db.Team();
    team.leagueId = leagueId;
    team.accountId = accountId; 

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
    const team = await getTeam(id);
    await team.destroy();
}

async function getTeam(id) {
    const team = await db.Team.findByPk(id);
    if (!team) throw 'Team not found';
    return team;
}

async function initDraft(id, draftPick) {
    const {budget} = config.teamBudget;
    const team = await getTeam(id);
    team.draftPick = draftPick;
    team.budget = budget;
    await team.save();
}