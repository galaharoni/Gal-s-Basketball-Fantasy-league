const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const playerService = require('./player.service');
const authorize = require('_middleware/authorize');

// routes

router.get('/league/:leagueid', authorize(), getFreeAgents);
router.get('/league/:leagueid/team/:teamid', authorize(), GetTeamPlayers);
router.put('/id/:id/teamid/:teamid', authorize(), update);
router.delete('/id/:id/teamid/:teamid', authorize(), _delete);
module.exports = router;

// route functions

function getFreeAgents(req, res, next) {
    playerService.getFreeAgents(req.params.leagueid)
        .then(players => res.json(players))
        .catch(next);
}

function GetTeamPlayers(req, res, next) {
    playerService.getTeamPlayers(req.params.leagueid, req.params.teamid)
        .then(players => res.json(players))
        .catch(next);
}

function update(req, res, next) {
    playerService.addPlayer(req.params.id, req.params.teamid)
        .then(() => res.json({ message: 'Player updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    playerService.removePlayer(req.params.id, req.params.teamid)
        .then(() => res.json({ message: 'Player removed' }))
        .catch(next);
}


// schema functions


function updateSchema(req, res, next) {
    const schema = Joi.object({
        teamId: Joi.number().required()
    });
    validateRequest(req, next, schema);
}
