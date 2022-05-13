import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';

import { gameDateService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [gameDates, setGameDates] = useState(null);
    Moment.locale('en');

    useEffect(() => {
        gameDateService.getAll().then(x => setGameDates(x));
    }, []);

    return (
        <div>
            <h1>Game Dates</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Current Date</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {gameDates && gameDates.map(gameDate =>
                        <tr key={gameDate.id}>
                            <td>{Moment(gameDate.currentDate).format('DD-MM-YYYY')}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${gameDate.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                            </td>
                        </tr>
                    )}
                    {!gameDates &&
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