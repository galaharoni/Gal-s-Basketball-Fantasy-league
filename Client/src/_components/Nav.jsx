import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import { teamService } from '@/_services';

/**
 * Nav: top menu
 * @returns 
 */
function Nav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav">
                    <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                    <NavLink to="/leagues" className="nav-item nav-link">Leagues</NavLink>                    
                    <NavLink to="/teams" className="nav-item nav-link" onClick={() =>teamService.leagueIdValue = 0}>My Teams</NavLink>                                        
                    {user.role === Role.Admin &&
                        <NavLink to="/admin" className="nav-item nav-link">Admin</NavLink>
                    }
                    <NavLink to="/profile" className="nav-item nav-link">Profile</NavLink>
                    <a onClick={accountService.logout} className="nav-item nav-link">Logout {user.firstName} {user.lastName}</a>
                </div>
            </nav>
            <Route path="/admin" component={AdminNav} />
        </div>
    );
}

/**
 * AdminNav: sub menu
 * @param {*} param0 
 * @returns 
 */
function AdminNav({ match }) {
    const { path } = match;

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light">
            <div className="navbar-nav">
                <NavLink to={`${path}/users`} className="nav-item nav-link">Users</NavLink>
                <NavLink to={`${path}/gameDates`} className="nav-item nav-link">Game Date</NavLink>
            </div>
        </nav>
    );
}



export { Nav }; 