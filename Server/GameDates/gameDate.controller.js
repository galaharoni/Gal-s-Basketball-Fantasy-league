const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const gameDateService = require('./gameDate.service');
const authorize = require('_middleware/authorize');

// routes
/**
 * rout input to the functions after validating authrization 
 * and validating scheme where required
 */

router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(Role.Admin), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
module.exports = router;

// route functions
/**
 * getAll: get the game dates 
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll(req, res, next) {
    gameDateService.getAll()
        .then(gameDates => res.json(gameDates))
        .catch(next);
}
/**
 * getById: get game date by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(req, res, next) {
    gameDateService.getById(req.params.id)
        .then(gameDates => res.json(gameDates))
        .catch(next);
}
/**
 * update: update the game date
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(req, res, next) {
    gameDateService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'game date updated' }))
        .catch(next);
}

// schema functions
/**
 * updateSchema: scheme for validating parameters for updating a league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function updateSchema(req, res, next) {
    const schema = Joi.object({
        currentDate: Joi.date().required()
    });
    validateRequest(req, next, schema);
}
