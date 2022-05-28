const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const leagueService = require('./league.service');
const leagueMode = require('../_helpers/leagueMode');
const authorize = require('_middleware/authorize')

/**
 * routes
 * rout input to the functions after validating authrization 
 * and validating scheme where required
 */ 

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.get('/pickingOwnerOfLeauge/:id', authorize(), getPickingTeamOwnerName);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

// route functions
/**
 * getAll: return all leagues
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll(req, res, next) {
    leagueService.getAll()
        .then(leagues => res.json(leagues))
        .catch(next);
}
/**
 * getById: return league by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(req, res, next) {
    leagueService.getById(req.params.id)
        .then(league => res.json(league))
        .catch(next);
}
/**
 * getPickingTeamOwnerName: return name of the owner of the team which is currentl picking free agents in the draft
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getPickingTeamOwnerName(req, res, next) {
    leagueService.getPickingTeamOwnerName(req.params.id)
        .then(league => res.json(league))
        .catch(next);
}

/**
 * create: create a new leauge
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function create(req, res, next) {
    leagueService.create(req)
        .then(() => res.json({ message: 'league created' }))
        .catch(next);
}
/**
 * update: update league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(req, res, next) {
    leagueService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'league updated' }))
        .catch(next);
}
/**
 * _delete: delete league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function _delete(req, res, next) {
    leagueService.delete(req.params.id)
        .then(() => res.json({ message: 'league deleted' }))
        .catch(next);
}

// schema functions
/**
 * createSchema: scheme for validating parameters for creating a league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function createSchema(req, res, next) {
    const schema = Joi.object({
        leagueName: Joi.string().required(),
        rounds: Joi.number().required(),
        teamsCount: Joi.number().required(),
        leagueMode: Joi.string().valid(leagueMode.Create, leagueMode.Draft, leagueMode.Run, leagueMode.Close).required()
    });
    validateRequest(req, next, schema);
}
/**
 * updateSchema: scheme for validating parameters for updating a league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function updateSchema(req, res, next) {
    const schema = Joi.object({
        leagueName: Joi.string().required(),
        rounds: Joi.number().required(),
        teamsCount: Joi.number().required(),
        leagueMode: Joi.string().valid(leagueMode.Create, leagueMode.Draft, leagueMode.Run, leagueMode.Substitutaions, leagueMode.Close).required()
    });
    validateRequest(req, next, schema);
}
