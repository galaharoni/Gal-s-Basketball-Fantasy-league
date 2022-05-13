const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const leagueService = require('./league.service');
const leagueMode = require('../_helpers/leagueMode');
const authorize = require('_middleware/authorize')

// routes

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    leagueService.getAll()
        .then(leagues => res.json(leagues))
        .catch(next);
}

function getById(req, res, next) {
    leagueService.getById(req.params.id)
        .then(league => res.json(league))
        .catch(next);
}

function create(req, res, next) {
    leagueService.create(req)
        .then(() => res.json({ message: 'league created' }))
        .catch(next);
}

function update(req, res, next) {
    leagueService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'league updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    leagueService.delete(req.params.id)
        .then(() => res.json({ message: 'league deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        leagueName: Joi.string().required(),
        rounds: Joi.number().required(),
        teamsCount: Joi.number().required(),
        substitutionCycle: Joi.number().required(),
        publicLeague: Joi.boolean().required(),
        leagueMode: Joi.string().valid(leagueMode.Create, leagueMode.Draft, leagueMode.Run, leagueMode.Close).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        leagueName: Joi.string().required(),
        rounds: Joi.number().required(),
        teamsCount: Joi.number().required(),
        substitutionCycle: Joi.number().required(),
        publicLeague: Joi.boolean().required(),
        leagueMode: Joi.string().valid(leagueMode.Create, leagueMode.Draft, leagueMode.Run, leagueMode.Substitutaions, leagueMode.Close).required()
    });
    validateRequest(req, next, schema);
}
