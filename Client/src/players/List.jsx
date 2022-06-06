import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { useLocation } from "react-router-dom";

import { teamService } from '@/_services';
import { leagueService } from '@/_services';
import { playerService } from '@/_services';
import { accountService } from '@/_services';
import { alertService } from '@/_services';
import {currencyFormat} from '@/_helpers';

/**
 * List: display list of players
 * @param {*} param0 
 * @returns 
 */
function List({ match }) {

    /*
        This list is used for two screens; team players and free agents of the league.
        Displaying team players requires the team id. The screen will display League name, team owner account name and the players of the team. 
        Displaying the free agents requires the league id. The screen will display League name, and free agents. 
     */

    const { path } = match;
    const [players, setPlayers] = useState(null);
    const [viewLeauge, setLeauge] = useState(null);
    const [teamOwner, setTeamOwner] = useState(null);
    const [team, setTeam] = useState(teamService.teamValue);
    const [pickingOwner, setPickingOwner] = useState(null);

    const history = useHistory();
   
    let teamPlayers = playerService.teamPlayersValue;
    const location = useLocation();
     
    /**
     * load players
     */ 
    useEffect(() => {
        leagueService.getById(team.leagueId).then(x=> setLeauge(x));
        leagueService.getPickingTeamOwnerName(team.leagueId).then(x=> setPickingOwner(x));
        if (teamPlayers){
            playerService.getTeamPlayers(team.leagueId, team.id).then(x => setPlayers(x));
            accountService.getById(team.accountId).then(x => setTeamOwner(x));
        }else{
            playerService.getFreeAgents(team.leagueId).then(x => setPlayers(x));
        }
    }, [location.key]);

    /**
     * selectPlayer: handels releasing players in team players mode or signing players to a team
     * @param {*} id 
     * @returns 
     */
    function selectPlayer(id) {
        let msg = 'Are you sure you wish to sign this player?'
        if (teamPlayers)
            msg = 'Are you sure you wish to release this player?'
            
        if (window.confirm(msg)===false)
            return

        setPlayers(players.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
    
        if (teamPlayers) {
            playerService.removePlayer(id, team.id).then(() => {
                setPlayers(players => players.filter(x => x.id !== id));
                teamService.getById(team.id).then(x => {
                    setTeam(x);
                    playerService.teamPlayersValue = true;        
                    history.push(`${path}`)              
                }).catch(error => {
                    alertService.error(error);;
                    })
            });
        }
        else {
            let inBudget = true;
            players.map(x => {
                if (x.id === id) { 
                    if (team.budget < x.worth){
                        alert('there is no budget to sign the player');
                        inBudget = false;
                        x.isDeleting = false;
                    }

                }
                return x;
            })

            if (!inBudget)
                return;            
                
            playerService.addPlayer(id, team.id).then(() => {
                setPlayers(players => players.filter(x => x.id !== id));
                teamService.getById(team.id).then(x => {
                    setTeam(x);
                    playerService.teamPlayersValue = true;        
                    history.push(`${path}`)
                });          
            });    
        }    
    }

    /**
     * freeAgents: sets the page mode to free agent
     */
    function freeAgents(){
        playerService.teamPlayersValue = false;        
        history.push(`${path}`)
    }

    /**
     * toTeamPlayers: sets the page mode to team players
     */
    function toTeamPlayers(){
        playerService.teamPlayersValue = true;        
        history.push(`${path}`)
    }

    /**
     * generate html table of leagues
     */
    return (        
        <div>
            {teamPlayers?<h1>Team Players</h1>:<h1>Free Agents</h1>}
            <h5>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Team Owner</th>
                        <th style={{ width: '20%' }}>League</th>
                        <th style={{ width: '20%' }}>Leauge Mode</th>
                        <th style={{ width: '20%' }}>Picking Team Owner</th>
                        <th style={{ width: '20%' }}>Team Budget</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{teamOwner?teamOwner.firstName + ' ' + teamOwner.lastName:''}</td>
                        <td>{viewLeauge?viewLeauge.leagueName:''}</td>
                        <td>{viewLeauge?viewLeauge.leagueMode:''}</td>
                        <td>{pickingOwner?pickingOwner.firstName + ' ' + pickingOwner.lastName:''}</td>
                        <td>{team? currencyFormat(team.budget):''}</td>
                    </tr>
                </tbody>
            </table>                                
            </h5>
            {teamPlayers && viewLeauge && viewLeauge.leagueMode=="Draft" && team.accountId==accountService.userValue.id && viewLeauge.pickingTeam==team.draftPick?<button onClick={() => freeAgents()} className="btn btn-sm btn-success" style={{ whiteSpace: 'nowrap' }}>
                <span>Sign Free Agent</span>
            </button>:""}
            {teamPlayers && viewLeauge && viewLeauge.leagueMode=="Draft" && team.accountId==accountService.userValue.id && viewLeauge.pickingTeam!=team.draftPick?<button onClick={() => toTeamPlayers()} className="btn btn-sm btn-info" style={{ whiteSpace: 'nowrap' }}>
                <span>Refresh</span>
            </button>:""}            
            {!teamPlayers?<button onClick={() => toTeamPlayers()} className="btn btn-sm btn-info" style={{ whiteSpace: 'nowrap' }}>
                <span>Back</span>
            </button>:""}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Player</th>
                        <th style={{ width: '20%' }}>Average Points</th>
                        <th style={{ width: '20%' }}>Average Rebounds</th>
                        <th style={{ width: '20%' }}>Average Assists</th>
                        <th style={{ width: '20%' }}>Average Steals</th>
                        <th style={{ width: '20%' }}>Average Blocks</th>
                        <th style={{ width: '20%' }}>Average Turnovers</th> 
                        <th style={{ width: '20%' }}>Draft Grade</th>                       
                        <th style={{ width: '20%' }}>Worth</th> 
                        <th style={{ width: '20%' }}>Score</th> 
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {players && players.map(player =>
                        <tr key={player.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{player.player}</td>
                            <td>{parseFloat(player.avgPoints).toFixed(2)}</td>
                            <td>{parseFloat(player.avgRebounds).toFixed(2)}</td>
                            <td>{parseFloat(player.avgAssists).toFixed(2)}</td>
                            <td>{parseFloat(player.avgSteals).toFixed(2)}</td>
                            <td>{parseFloat(player.avgBlocks).toFixed(2)}</td>
                            <td>{parseFloat(player.avgTurnovers).toFixed(2)}</td>                    
                            <td>{parseFloat(player.grade).toFixed(0)}</td>
                            <td>{currencyFormat(player.worth)}</td>
                            <td>{player.score? parseFloat(player.score).toFixed(2):''}</td>                    
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => selectPlayer(player.id)} className="btn btn-sm btn-danger" disabled={player.isDeleting || (team.accountId!=accountService.userValue.id)|| (viewLeauge.leagueMode!="Draft")}>
                                    {player.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : teamPlayers?<span style={{ whiteSpace: 'nowrap' }}>Release Player</span>:<span style={{ whiteSpace: 'nowrap' }}>Sign Player</span>
                                    }    
                                </button>
                            </td>
                        </tr>
                    )}
                    {!players &&
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