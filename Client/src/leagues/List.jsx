import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'

import { leagueService } from '@/_services';
import { accountService } from '@/_services';
import { teamService } from '@/_services';



function List({ match }) {
    const { path } = match;
    const [leagues, setLeagues] = useState(null);
    const user = accountService.userValue;
    const history = useHistory();

    useEffect(() => {
        leagueService.getAll().then(x => setLeagues(x));
    }, []);

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

    function viewTeams(leagueId){
        teamService.leagueIdValue = leagueId;
        history.push(`${path}/teams`)
    }
    

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

    return (
        <div>
            <h1>Leagues</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add League</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '40%' }}>Name</th>
                        <th style={{ width: '10%' }}>Rounds</th>
                        <th style={{ width: '10%' }}>Max Teams Count</th>
                        <th style={{ width: '10%' }}>Substitution Cycle</th>                        
                        <th style={{ width: '10%' }}>Public League</th>                        
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
                            <td>{league.teamsCount}</td>
                            <td>{league.substitutionCycle}</td>
                            <td>{league.publicLeague ? "Yes" : "No"}</td>     
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