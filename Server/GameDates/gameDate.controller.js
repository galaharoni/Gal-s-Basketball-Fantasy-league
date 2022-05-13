const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const gameDateService = require('./gameDate.service');
const authorize = require('_middleware/authorize');

// routes

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
module.exports = router;

// route functions

function getAll(req, res, next) {
    gameDateService.getAll()
        .then(gameDates => res.json(gameDates))
        .catch(next);
}

function getById(req, res, next) {
    gameDateService.getById(req.params.id)
        .then(gameDates => res.json(gameDates))
        .catch(next);
}
function update(req, res, next) {
    gameDateService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'game date updated' }))
        .catch(next);
}

// schema functions

function updateSchema(req, res, next) {
    const schema = Joi.object({
        currentDate: Joi.date().required()
    });
    validateRequest(req, next, schema);
}
