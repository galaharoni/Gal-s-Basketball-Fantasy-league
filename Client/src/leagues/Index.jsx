import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { Teams } from '../teams';

function Leagues({ match }) {
    const { path } = match;
    
    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={List} />
                    <Route path={`${path}/add`} component={AddEdit} />
                    <Route path={`${path}/edit/:id`} component={AddEdit} />
                    <Route path={`${path}/teams`} component={Teams} />
                </Switch>
            </div>
        </div>
    );
}

export { Leagues };