import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { accountService, alertService } from '@/_services';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'moment';

import { gameDateService } from '../../_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = false;
    const [startDate, setStartDate] = useState(new Date());
    
    const initialValues = {
        currentDate: ''
    };

    const validationSchema = Yup.object().shape({
        currentDate: Yup.string()
            .required('current date is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        fields.currentDate = startDate;
        updateGameDate(id, fields, setSubmitting);
    }

    function updateGameDate(id, fields, setSubmitting) {
        gameDateService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    // get current date and set form fields
                    gameDateService.getById(id).then(gameDate => {
                        const fields = ['currentDate'];
                        fields.forEach(field => setFieldValue(field, gameDate[field], false));                        
                        //TODO: init calendar with currentDate
                        //setStartDate(Moment(gameDate.currentDate));
                        //alert(startDate);
                        //setStartDate(null);            
                    });
                }, []);

                return (
                    <Form>
                        <h1>{'Update Current Date'}</h1>
                        <br></br>
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label>Current Date</label>
                                <Field name="currentDate" type="text" className={'form-control' + (errors.currentDate && touched.currentDate ? ' is-invalid' : '')} />
                                <ErrorMessage name="currentDate" component="div" className="invalid-feedback" />
                                <DatePicker dateFormat='dd/MM/yyyy' selected={startDate ? startDate : moment()} onChange={(date) => setStartDate(date)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={'..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };