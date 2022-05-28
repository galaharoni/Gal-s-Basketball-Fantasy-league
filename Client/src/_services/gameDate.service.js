import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/gameDates`;

/**
 * game date service interface
 */
export const gameDateService = {
    getAll,
    getById,
    update
};

/**
 * getAll: get the game dates 
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll() {
    return fetchWrapper.get(baseUrl);
}

/**
 * getById: get game date by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

/**
 * update: update the game date
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}



