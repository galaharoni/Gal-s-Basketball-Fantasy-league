const config = require('config.json');
const db = require('_helpers/db');
const teamManager = require('../Teams/team.manager');

module.exports = {
    getAll,
    getById,
    update,
    create
};

/**
 * getAll: get game date
 */
async function getAll() {
    return await db.gameDate.findAll();
}

/**
 * getById: get game date by id
 * @param  {} id
 */
async function getById(id) {
    return await getGameDate(id);
}

/**
 * update: update the game date
 * @param  {} id
 * @param  {} params
 */
async function update(id, params) {
    //Validate input date is not later than end date
    const currentDateObj = new Date(params.currentDate);
    const {endDate} = config.gameDates;
    const endDateObj = new Date(endDate);

    console.log("currentDate:" + currentDateObj.getTime() + " endDate:"+ endDateObj.getTime());
    if (currentDateObj.getTime()>endDateObj.getTime())
        throw 'Current Date cannot be after End Date';


    //add points to teams according to the players performace    
    const connection = await db.getDBConn();
    const query = `CALL spAddScore(?)`    

    console.log('query=' + query + ' current date:'+params.currentDate);
    
    await connection.query(query, [params.currentDate],  (err, rows) => {
        if(err) throw err;  
        console.log(rows);
    });    

    // set team places in leagues
    await teamManager.setPlaces();
}

// helper functions
/**
 * getGameDate: get game dates
 * @param  {} id
 */
async function getGameDate(id) {
    const gameDate = await db.gameDate.findByPk(id);
    if (!gameDate) throw 'game date not found';
    return gameDate;
}
/**
 * create: create game date
 */
async function create() {
    // validate table is empty as there is only one row for the current date
    if (await db.gameDate.findOne()) {
        console.log('Game date is not empty');
        return;
    }

    const {startDate, endDate} = config.gameDates;
    const gameDate = new db.gameDate();
    gameDate.currentDate=startDate;
    gameDate.endDate=endDate;
    
    // save league
    await gameDate.save();
}

