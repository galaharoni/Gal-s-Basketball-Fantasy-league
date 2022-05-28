/**
 * Service for calling server player APIs
 */

import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const teamPlayersSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/players`;

/**
 * player service interface
 */
export const playerService = {
    getTeamPlayers,
    getFreeAgents,
    addPlayer,  
    removePlayer,
    teamPlayers: teamPlayersSubject.asObservable(),
    get teamPlayersValue () { return teamPlayersSubject.value },
    set teamPlayersValue (teamPlayers) {teamPlayersSubject.next(teamPlayers);}    
};

/**
 * GetTeamPlayers: get players by team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getTeamPlayers(leagueId, teamId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}/team/${teamId}`);
}
/**
 * getFreeAgents: return players of league not associated with any team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function getFreeAgents(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}`);
}

/**
 * addPlayer: add player to a team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
function addPlayer(id, teamid) {
    return fetchWrapper.put(`${baseUrl}/id/${id}/teamid/${teamid}`);
}

/**
 * removePlayer: remove the player from team
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */

function removePlayer(id, teamid) {
    let params = '{teamid :' + teamid + '}'
    return fetchWrapper.delete(`${baseUrl}/id/${id}/teamid/${teamid}`);
}


