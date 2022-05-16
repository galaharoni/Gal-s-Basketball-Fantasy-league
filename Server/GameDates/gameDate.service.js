const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    update,
    create
};


async function getAll() {
    return await db.gameDate.findAll();
}

async function getById(id) {
    return await getGameDate(id);
}

async function update(id, params) {
    const gameDate = await getGameDate(id);

    //todo: validate input date in raw data
    // copy params to league Player player and save
    Object.assign(gameDate, params);
    await gameDate.save();
}

// helper functions

async function getGameDate(id) {
    const gameDate = await db.gameDate.findByPk(id);
    if (!gameDate) throw 'game date not found';
    return gameDate;
}

async function create() {
    // validate table is empty as there is only one row for the current date
    if (await db.gameDate.findOne()) {
        console.log('Game date is not empty');
        return;
    }

    const gameDate = new db.gameDate();
    gameDate.currentDate='2021-05-05';
    
    // save league
    await gameDate.save();
}

