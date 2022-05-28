import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;
    /**
     * generate html page for admin
     */
    return (
        <div>
            <h1>Admin</h1>
            <p>This section can only be accessed by administrators.</p>
            <p><Link to={`${path}/gameDates`}>Game Dates</Link></p>
        </div>
    );
}

export { Overview };