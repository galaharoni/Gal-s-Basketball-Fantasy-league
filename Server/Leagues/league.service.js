const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const randomTokenString = require('_helpers/randomTokenString');
const teamService = require('../Teams/team.service');
const playerService = require('../Players/player.service');
const LeagueMode = require('_helpers/leagueMode');
const accountService = require('../accounts/account.service');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    setDraft,
    nextPick,
    getPickingTeamOwnerName,
    getRunningLeagues
};
/**
 * getAll: get all leagues and the name of their owners order by name
 */
async function getAll() {
    return await db.League.findAll({
        include: [{
            model: db.Account,
            attributes: ['firstName', 'lastName']
        }],
        order: [["leagueName", "ASC"]]
    });
}
/**
 * getRunningLeagues: get leagues in running mode
 */
async function getRunningLeagues() {
    return await db.League.findAll({
        include: [{
            model: db.Account,
            attributes: ['id']
        }],
        where: { leagueMode: 'Run' }
    });
}
/**
 * getById:get league by id
 * @param  {} id
 */
async function getById(id) {
    return await getLeague(id);
}
/**
 * getPickingTeamOwnerName: get picking team owner by name
 * @param  {} id
 */
async function getPickingTeamOwnerName(id) {
    const league = await getLeague(id);
    const teams = await teamService.getByLeague(id);
    let account;
    const unresolved = teams.map(async (x)=>{
        if (x.draftPick == league.pickingTeam){
            account = await accountService.getById(x.accountId);
        }
    })

    const resolved = await Promise.all(unresolved);

    const { firstName, lastName} = account;
    return { firstName, lastName};
}

/**
 * create: create league
 * @param  {} req
 */
async function create(req) {
    const params = req.body;
    // validate
    if (await db.League.findOne({ where: { leagueName: params.leagueName } })) {
        throw 'League Name "' + params.leagueName + '" is already registered';
    }

    const league = new db.League(params);

    // leauge code
    league.leagueCode = randomTokenString()

    league.accountId = req.user.id; //accountid of logged-in user

    // Teams
    // save league
    await league.save();

    // get league, so can get league id
    const newLeague = await db.League.findOne({ where: { leagueName: params.leagueName } });
    if (!newLeague) throw 'League not found';

    //add team of league owner to the leauge
    await teamService.create(newLeague.id, req.user.id);
}

/**
 * update: update league
 * @param  {} id
 * @param  {} params
 */
async function update(id, params) {
    const league = await getLeague(id);

    // validate
    const leagueNameChanged = params.leagueName && league.leagueName !== params.leagueName;
    if (leagueNameChanged && await db.League.findOne({ where: { leagueName: params.leagueName } })) {
        throw 'League Name "' + params.leagueName + '" is already registered';
    }

    // copy params to league and save
    Object.assign(league, params);
    await league.save();

    //initiate draft if manually moved to draft
    if (params.leagueMode == LeagueMode.Draft) {
        setDraft(league);
    }
}
/** 
 * _delete: delete league
 * @param  {} id
 */
async function _delete(id) {
    const user = await getLeague(id);
    await user.destroy();
}

/**
 * setDraft: set draft mode
 * preforms the draft draw
 * create the players in the league by calling player service
 * @param  {} league
 */
async function setDraft(league) {
    //create draft draw
    var arr = [];
    while (arr.length < league.teamsCount) {
        var r = Math.floor(Math.random() * league.teamsCount);
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    console.log('draft pick:' + arr);

    //init picking team
    league.pickingTeam = 0;
    await league.save();

    //Set pick
    teams = await teamService.getByLeague(league.id);
    const unresolved = teams.map(async (team, idx) => {
        console.log('initDraft id:' + team.id + ' pick:' + arr[idx]);
        await teamService.initDraft(team.id, arr[idx])
    }
    )

    const resolved = await Promise.all(unresolved);

    //create league players
    await playerService.createLeaguePlayers(league.id);
}

/**
 * nextPick: update the picking team to the next team in the league
 * @param  {} leagueId
 */
async function nextPick(leagueId) {
    const league = await getById(leagueId);
    league.pickingTeam = (league.pickingTeam + 1) % league.teamsCount;
    await league.save();
}
// helper functions
/**
 * getLeague: get league by id
 * @param  {} id
 */
async function getLeague(id) {
    const league = await db.League.findByPk(id);
    if (!league) throw 'League not found';
    return league;
}
