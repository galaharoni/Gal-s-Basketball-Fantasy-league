const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const teamService = require('./team.service');
const authorize = require('_middleware/authorize');

// routes

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.get('/league/:id', authorize(), getByLeague);
router.get('/account/:id', authorize(), getByAccount);
router.put('/league/:id', authorize(), joinLeague);
router.get('/league/account/:id', authorize(), getByLeagueNaccount);
module.exports = router;

// route functions

function getAll(req, res, next) {
    teamService.getAll()
        .then(teams => res.json(teams))
        .catch(next);
}

function getById(req, res, next) {
    teamService.getById(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}

function getByLeague(req, res, next) {
    teamService.getByLeague(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}

function getByAccount(req, res, next) {
    teamService.getByAccount(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}
function getByLeagueNaccount(req, res, next) {
    teamService.getByLeagueNaccount(req.params.id, req.user.id)
        .then(teams => res.json(teams))
        .catch(next);
}

function create(req, res, next) {
    teamService.create(req)
        .then(() => res.json({ message: 'Team created' }))
        .catch(next);
}

function update(req, res, next) {
    teamService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Team updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    teamService.delete(req.params.id)
        .then(() => res.json({ message: 'Team deleted' }))
        .catch(next);
}

function joinLeague(req, res, next) {
    teamService.joinLeague(req.params.id, req.user.id)
        .then(() => res.json({ message: 'Joined league' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        leagueId: Joi.number().required(),
        ownerAccountId: Joi.number().required(),
        draftPick: Joi.number().optional()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        leagueId: Joi.number().required(),
        ownerAccountId: Joi.number().required(),
        draftPick: Joi.number().optional()
    });
    validateRequest(req, next, schema);
}
