import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';

function GameDates({ match }) {
    const { path } = match;    
    
    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/edit/:id`} component={AddEdit} />
        </Switch>
    );
}

export { GameDates };