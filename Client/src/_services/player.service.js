import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const teamPlayersSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/players`;

export const playerService = {
    getTeamPlayers,
    getFreeAgents,
    addPlayer,  
    removePlayer,
    teamPlayers: teamPlayersSubject.asObservable(),
    get teamPlayersValue () { return teamPlayersSubject.value },
    set teamPlayersValue (teamPlayers) {teamPlayersSubject.next(teamPlayers);}    
};

function getTeamPlayers(leagueId, teamId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}/team/${teamId}`);
}

function getFreeAgents(leagueId) {
    return fetchWrapper.get(`${baseUrl}/league/${leagueId}`);
}

function addPlayer(id, teamid) {
    return fetchWrapper.put(`${baseUrl}/id/${id}/teamid/${teamid}`);
}

function removePlayer(id, teamid) {
    let params = '{teamid :' + teamid + '}'
    return fetchWrapper.delete(`${baseUrl}/id/${id}/teamid/${teamid}`);
}


