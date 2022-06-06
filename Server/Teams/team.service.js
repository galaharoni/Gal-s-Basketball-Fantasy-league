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
/**
 * getTeamsCount: get the team count of the league 
 * @param  {} leagueId
 */
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
/**
 * getByLeagueNaccount: get team of a specific account in a specific league
 * @param  {} leagueId
 * @param  {} accountId
 */
async function getByLeagueNaccount(leagueId, accountId) {
    return await db.Team.findAll({
        where: 
            {leagueId: leagueId, 
            accountId: accountId},
        include: [{
            model: db.Account,
            attributes: ['firstName', 'lastName']
        }]
    });
}
/**
 * getByLeague: get team by league id
 * @param  {} leagueId
 */
async function getByLeague(leagueId) {
    return await db.Team.findAll({
        where: {leagueId: leagueId},
        include: [{
            model: db.Account,
            attributes: ['firstName', 'lastName']
        }],
        order: [['score', 'DESC'],['draftPick','ASC']]
    });
}
/**
 * getByAccount: get team by account
 * @param  {} accountId
 */
async function getByAccount(accountId) {
    return await db.Team.findAll({
        where: {accountId: accountId},
        include: [db.League],
        order: [['place', 'ASC']]
    });
}
/**
 * getAll: return all teams
 */
async function getAll() {
    return await db.Team.findAll()
}
/**
 * getById: return by team id
 * @param  {} id
 */
async function getById(id) {
    return await getTeam(id);
}
/**
 * create: create a new team in league
 * @param  {} leagueId
 * @param  {} accountId
 */
async function create(leagueId, accountId) {
    // Teams

    const team = new db.Team();
    team.leagueId = leagueId;
    team.accountId = accountId; 

    // save team
    await team.save();
}
/**
 * update: update team in a league
 * @param  {} id
 * @param  {} params
 */
async function update(id, params) {
    const team = await getTeam(id);

    // copy params to league Player player and save
    Object.assign(team, params);
    await team.save();
}
/**
 * _delete: delete team 
 * @param  {} id
 */
async function _delete(id) {
    const team = await getTeam(id);
    await team.destroy();
}
/**
 * getTeam: get team by id
 * @param  {} id
 */
async function getTeam(id) {
    const team = await db.Team.findByPk(id);
    if (!team) throw 'Team not found';
    return team;
}
/**
 * initDraft: sset budget and draft peak for a team
 * @param  {} id
 * @param  {} draftPick
 */
async function initDraft(id, draftPick) {
    const {budget} = config.teamBudget;
    const team = await getTeam(id);
    team.draftPick = draftPick;
    team.budget = budget;
    await team.save();
}

