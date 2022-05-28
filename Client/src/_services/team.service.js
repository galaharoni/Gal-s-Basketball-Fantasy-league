import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const teamSubject = new BehaviorSubject(null);
const leagueIdSubject = new BehaviorSubject(null);

const baseUrl = `${config.apiUrl}/teams`;

/**
 * team service interface
 */
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

// route functions
/**
 * getAll: return all teams
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getAll() {
    return fetchWrapper.get(baseUrl);
}

/**
 * getById: get team by id
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

/**
 * getByLeague: get teams of a league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getByLeague(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}`);
}

/**
 * getByLeagueNaccount: get team of a specific account in a specific league
 * @param  {} req: request
 * @param  {} res: response
 * @param  {} next: errors
 */
function getByLeagueNaccount(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/account/${leagueId}`);
}

/**
 * getByAccount: get teams by account
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getByAccount(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}`);
}

/**
 * create: create a new team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

/**
 * update: update the team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

/**
 * joinLeague: create team in league
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function joinLeague(id) {
    return fetchWrapper.put(`${baseUrl}/league/${id}`);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}


