import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/leagues`;

export const leagueService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {    
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}


