import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import { teamService } from '@/_services';
import { leagueService } from '@/_services';
import { accountService } from '@/_services';
import { playerService } from '../_services/player.service';
import {currencyFormat} from '@/_helpers';

/**
 * List: display list of teams, either for a specific league or a specific account 
 * @param {*} param0 
 * @returns 
 */
function List({ match }) {
    const { path } = match;
    const [teams, setTeams] = useState(null);
    const [myTeam, setMyTeam] = useState(null);
    const [viewLeauge, setLeauge] = useState(null);
    let leagueid = teamService.leagueIdValue;
    const isMyTeams = !leagueid;
    const user = accountService.userValue;    
    const history = useHistory();
    
    //load data for teams list
    useEffect(() => {
        if (isMyTeams){
            // account teams
            teamService.getByAccount(user.id).then(x => setTeams(x));
        }else{
            // leagues teams
            teamService.getByLeague(leagueid).then(x => setTeams(x));      
            teamService.getByLeagueNaccount(leagueid).then(x => setMyTeam(x))
            leagueService.getById(leagueid).then(x=> setLeauge(x));
        }
    }, [location.key]);
    
    /**
     * deleteTeam: delete team by id
     * @param {*} id 
     * @returns 
     */
    function deleteTeam(id) {
        if (window.confirm('Are you sure you wish to delete this team?')===false)
            return
        setTeams(teams.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        teamService.delete(id).then(() => {
            setTeams(teams => teams.filter(x => x.id !== id));            
            setMyTeam([]);
        });
    }

    /**
     * joinLeague: add team to a league
     * @param {*} leagueid 
     */
    function joinLeague(leagueid){
        teamService.joinLeague(leagueid).then(() => {
            teamService.getByLeague(leagueid).then(x => setTeams(x));            
            teamService.getByLeagueNaccount(leagueid).then(x => setMyTeam(x));
            leagueService.getById(leagueid).then(x=> setLeauge(x));
        })
        .catch(error => {
            alert(error);
            alertService.error(error);
        });
    }

    /**
     * viewTeam: route to team players
     * @param {*} team 
     */
    function viewTeam(team){
        teamService.teamValue = team;
        playerService.teamPlayersValue = true;        
        history.push(`${path}/players`);
    }

    /**
     * generate html table of leagues
     */
    return (        
        <div>
            {isMyTeams?<h1>My Teams</h1>:<h1> Teams of league: {viewLeauge?viewLeauge.leagueName:""}</h1>}
            {isMyTeams?<br></br>:<h4>Leauge Mode: {viewLeauge?viewLeauge.leagueMode:""}</h4>}
            {!isMyTeams && viewLeauge && viewLeauge.leagueMode=='Close'&&teams?<h4 className="text-center btn-info" style={{width: '100%'}}>THE WINNER IS: {teams?teams[0].account.firstName + " " + teams[0].account.lastName:""}</h4>:""}

            {!isMyTeams && myTeam && myTeam.length===0 && viewLeauge && teams && viewLeauge.teamsCount > teams.length ?<button onClick={() => joinLeague(leagueid)} className="btn btn-sm btn-success" style={{ whiteSpace: 'nowrap' }} disabled={false}>
                <span>Join League</span>
            </button>:<div></div>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {isMyTeams?<th style={{ width: '30%' }}>League Name</th> : <th style={{ width: '30%' }}>Owner</th>}
                        <th style={{ width: '20%' }}>Draft Pick</th>
                        <th style={{ width: '20%' }}>Budget</th>
                        <th style={{ width: '20%' }}>Score</th>
                        <th style={{ width: '20%' }}>Place</th>                       
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map(team =>
                        <tr key={team.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{isMyTeams&&team?team.League.leagueName: team.account.firstName + " " + team.account.lastName}</td>
                            <td>{team.draftPick+1}</td>
                            <td>{currencyFormat(team.budget)}</td>
                            <td>{team.score?parseFloat(team.score).toFixed(2):''}</td>
                            <td>{(team.place!=9999)?team.place:''}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => viewTeam(team)} className="btn btn-sm btn-info" style={{ width: '60px' }}>View</button>
                                &nbsp;
                                <button onClick={() => deleteTeam(team.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={team.isDeleting || (team.accountId !== user.id)}>
                                    {team.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }    
                                </button>
                            </td>
                        </tr>
                    )}
                    {!teams &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };