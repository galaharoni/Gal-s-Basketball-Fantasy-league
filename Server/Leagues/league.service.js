const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const randomTokenString = require('_helpers/randomTokenString');
const teamService = require('../Teams/team.service');
const playerService = require('../Players/player.service');
const LeagueMode = require('_helpers/leagueMode');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    setDraft
};

async function getAll() {
    return await db.League.findAll({
        include: [{
            model:db.Account,
            attributes:['firstName', 'lastName']
        }],
        order: [["leagueName","ASC"]]
    });
}

async function getById(id) {
    return await getLeague(id);
}

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
    //TODO: limit teams by number of players / 10

    // save league
    await league.save();

    // get league, so can get league id
    const newLeague = await db.League.findOne({ where: { leagueName: params.leagueName }});
    if (!newLeague) throw 'League not found';

    //add team of league owner to the leauge
    await teamService.create(newLeague.id, req.user.id);
}


async function update(id, params) {
    const league = await getLeague(id);

    // validate
    const leagueNameChanged = params.leagueName && league.leagueName !== params.leagueName;
    if (leagueNameChanged && await db.League.findOne({ where: { leagueName: params.leagueName } })) {
        throw 'League Name "' + params.leagueName + '" is already registered';
    }

    // Teams
    //TODO: limit teams by number of players / 10
    
    // copy params to league and save
    Object.assign(league, params);
    await league.save();

    //initiate draft if manually moved to draft
    if (params.leagueMode == LeagueMode.Draft){
        setDraft(league);
    }
}

async function _delete(id) {
    const user = await getLeague(id);
    await user.destroy();
}


async function setDraft(league) {
    //create draft draw
    var arr = [];
    while(arr.length < league.teamsCount){
        var r = Math.floor(Math.random() * league.teamsCount + 1);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    console.log('draft pick:' + arr);
    
    //Set pick
    teams = await teamService.getByLeague(league.id);
    const unresolved = teams.map(async(team, idx) => {
        console.log('initDraft id:'+team.id + ' pick:'+arr[idx]);
        await teamService.initDraft(team.id,arr[idx])
        }
    )

    const resolved = await Promise.all(unresolved);

    //create league players
    await playerService.createLeaguePlayers(league.id);
}

// helper functions

async function getLeague(id) {
    const league = await db.League.findByPk(id);
    if (!league) throw 'League not found';
    return league;
}
