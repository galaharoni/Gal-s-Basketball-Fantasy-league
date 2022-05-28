import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';

/**
 * Players: routing to/from players
 * @param {*} param0 
 * @returns 
 */
function Players({ match }) {
    const { path } = match;
    
    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={`${path}`} component={List} />
                </Switch>
            </div>
        </div>
    );
}

export { Players };