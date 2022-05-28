import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/leagues`;

/**
 * league service interface
 */
export const leagueService = {
    getAll,
    getById,
    getPickingTeamOwnerName,
    create,
    update,
    delete: _delete
};

// route functions
/**
 * getAll: return all leagues
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll() {
    return fetchWrapper.get(baseUrl);
}

/**
 * getById: return league by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

/**
 * getPickingTeamOwnerName: return name of the owner of the team which is currentl picking free agents in the draft
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getPickingTeamOwnerName(id) {
    return fetchWrapper.get(`${baseUrl}/pickingOwnerOfLeauge/${id}`);
}

/**
 * create: create a new leauge
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function create(params) {    
    return fetchWrapper.post(baseUrl, params);
}

/**
 * update: update league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}


