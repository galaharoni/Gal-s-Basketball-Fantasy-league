const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const teamService = require('./team.service');
const teamManager = require('./team.manager');
const authorize = require('_middleware/authorize');

// routes
/**
 * rout input to the functions after validating authrization 
 * and validating scheme where required
 */

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
/**
 * getAll: return all teams
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll(req, res, next) {
    teamService.getAll()
        .then(teams => res.json(teams))
        .catch(next);
}
/**
 * getById: get team by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(req, res, next) {
    teamService.getById(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}
/**
 * getByLeague: get teams of a league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getByLeague(req, res, next) {
    teamService.getByLeague(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}
/**
 * getByAccount: get teams by account
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getByAccount(req, res, next) {
    teamService.getByAccount(req.params.id)
        .then(teams => res.json(teams))
        .catch(next);
}
/**
 * getByLeagueNaccount: get team of a specific account in a specific league
 * @param  {} req: request
 * @param  {} res: response
 * @param  {} next: errors
 */
function getByLeagueNaccount(req, res, next) {
    teamService.getByLeagueNaccount(req.params.id, req.user.id)
        .then(teams => res.json(teams))
        .catch(next);
}
/**
 * create: create a new team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function create(req, res, next) {
    teamService.create(req)
        .then(() => res.json({ message: 'Team created' }))
        .catch(next);
}
/**
 * update: update the team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(req, res, next) {
    teamService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Team updated' }))
        .catch(next);
}
/**
 * _delete: delete the team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function _delete(req, res, next) {
    teamService.delete(req.params.id)
        .then(() => res.json({ message: 'Team deleted' }))
        .catch(next);
}
/**
 * joinLeague: create team in league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function joinLeague(req, res, next) {
    teamManager.joinLeague(req.params.id, req.user.id)
        .then(() => res.json({ message: 'Joined league' }))
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
        leagueId: Joi.number().required(),
        ownerAccountId: Joi.number().required(),
        draftPick: Joi.number().optional()
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
        leagueId: Joi.number().required(),
        ownerAccountId: Joi.number().required(),
        draftPick: Joi.number().optional()
    });
    validateRequest(req, next, schema);
}
