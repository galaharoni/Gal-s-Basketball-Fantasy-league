import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'

import { leagueService } from '@/_services';
import { accountService } from '@/_services';
import { teamService } from '@/_services';


/**
 * List: display list of leagues
 * @param {*} param0 
 * @returns 
 */
function List({ match }) {
    const { path } = match;
    const [leagues, setLeagues] = useState(null);
    const user = accountService.userValue;
    const history = useHistory();

    /**
     * load leagues
     */ 
    useEffect(() => {
        leagueService.getAll().then(x => setLeagues(x));
    }, [location.key]);

    /**
     * deleteLeague: delete a league by id
     * @param {*} id 
     * @returns 
     */
    function deleteLeague(id) {
        if (window.confirm('Are you sure you wish to delete this league?')===false)
            return
        setLeagues(leagues.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        leagueService.delete(id).then(() => {
            setLeagues(leagues => leagues.filter(x => x.id !== id));
        });
    }

    /**
     * viewTeams: route to teams of a specific league
     * @param {*} leagueId 
     */
    function viewTeams(leagueId){
        teamService.leagueIdValue = leagueId;
        history.push(`${path}/teams`)
    }
    
    /**
     * showButtons: show delete button for league owner and view teams button for everyone
     * @param {*} league 
     * @returns 
     */
    function showButtons(league) {
            return (
                <td style={{ whiteSpace: 'nowrap' }}>                    
                        <Link to={`${path}/edit/${league.id}`} className={league.accountId === user.id?"btn btn-sm btn-primary mr-1":"btn btn-sm btn-primary mr-1 disabled"}>Edit</Link>
                        <button onClick={() => deleteLeague(league.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={league.isDeleting || (league.accountId !== user.id)}>
                            {league.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Delete</span>
                            }
                        </button>
                        &nbsp;
                        <button onClick={() => viewTeams(league.id)} className="btn btn-sm btn-info">View</button>                        
                </td>)
    }
    /**
     * generate html table of leagues
     */
    return (
        <div>
            <h1>Leagues</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add League</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '10%' }}>Rounds</th>
                        <th style={{ width: '10%' }}>Current Round</th>
                        <th style={{ width: '10%' }}>Max Teams Count</th>                                                
                        <th style={{ width: '10%' }}>League Mode</th>                        
                        <th style={{ width: '10%' }}>Owner</th>                        
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {leagues && leagues.map(league =>
                        <tr key={league.id}>
                            <td>{league.leagueName}</td>
                            <td>{league.rounds}</td>
                            <td>{league.currentRound ? league.currentRound : ""}</td>
                            <td>{league.teamsCount}</td>
                            <td>{league.leagueMode}</td>                            
                            <td style={{ whiteSpace: 'nowrap' }}>{league.account.firstName + " " + league.account.lastName}</td>                            
                            {showButtons(league)}
                        </tr>
                    )}
                    {!leagues &&
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