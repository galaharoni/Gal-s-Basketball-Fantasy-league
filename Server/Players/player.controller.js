const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const playerService = require('./player.service');
const playerManager = require('./player.manager');
const authorize = require('_middleware/authorize');

/**
 * routes
 * rout input to the functions after validating authrization 
 * and validating scheme where required
 */

router.get('/league/:leagueid', authorize(), getFreeAgents);
router.get('/league/:leagueid/team/:teamid', authorize(), GetTeamPlayers);
router.put('/id/:id/teamid/:teamid', authorize(), update);
router.delete('/id/:id/teamid/:teamid', authorize(), _delete);
module.exports = router;

/**
 * route functions
 */ 
 
/**
 * getFreeAgents: return players of league not associated with any team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getFreeAgents(req, res, next) {
    playerService.getFreeAgents(req.params.leagueid)
        .then(players => res.json(players))
        .catch(next);
}
/**
 * GetTeamPlayers: get players by team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function GetTeamPlayers(req, res, next) {
    playerService.getTeamPlayers(req.params.leagueid, req.params.teamid)
        .then(players => res.json(players))
        .catch(next);
}
/**
 * update: add player to a team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(req, res, next) {
    playerManager.addPlayer(req.params.id, req.params.teamid)
        .then(() => res.json({ message: 'Player updated' }))
        .catch(next);
}
/**
 * _delete: remove the player from team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function _delete(req, res, next) {
    playerManager.removePlayer(req.params.id, req.params.teamid)
        .then(() => res.json({ message: 'Player removed' }))
        .catch(next);
}

