import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const teamSubject = new BehaviorSubject(null);
const leagueIdSubject = new BehaviorSubject(null);

const baseUrl = `${config.apiUrl}/teams`;

export const teamService = {
    getAll,
    getById,
    getByLeague,
    getByAccount,
    getByLeagueNaccount,
    joinLeague,
    create,
    update,
    delete: _delete,
    leagueId: leagueIdSubject.asObservable(),
    get leagueIdValue () { return leagueIdSubject.value },
    set leagueIdValue (leagueId) {leagueIdSubject.next(leagueId);},
    team: teamSubject.asObservable(),
    get teamValue () { return teamSubject.value },
    set teamValue (team) {teamSubject.next(team);},    
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getByLeague(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}`);
}

function getByLeagueNaccount(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/account/${leagueId}`);
}

function getByAccount(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function joinLeague(id) {
    return fetchWrapper.put(`${baseUrl}/league/${id}`);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}


