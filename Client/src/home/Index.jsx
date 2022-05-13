import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Overview } from './Overview';
import { Leagues } from '../leagues';

function Home({ match }) {
    const { path } = match;

    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Overview} />
                    <Route path={`$../leagues`} component={Leagues} />
                </Switch>
            </div>
        </div>
    );
}

export { Home };