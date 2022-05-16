import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Welcome to Gal's Basketball Fantasy league</h1>
            <p><Link to={`../leagues`}>View Leagues</Link></p>
            <div>
                {/*Todo: load image from web site*/}
                <img src='https://a1.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fmisc_logos%2F500%2Ffba.png' alt="Gal's Basketball Fantasy league logo" className="center"/>
            </div>
        </div>
    );
}

export { Overview };