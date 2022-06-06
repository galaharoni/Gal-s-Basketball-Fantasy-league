import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { Players } from '../players';

/**
 * Teams: routing to/from teams
 * @param {*} param0 
 * @returns 
 */
function Teams({ match }) {
    const { path } = match;
    return (        
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={List} />
                    <Route path={`${path}/players`} component={Players} />                    
                </Switch>
            </div>
        </div>
    );
}

export { Teams };