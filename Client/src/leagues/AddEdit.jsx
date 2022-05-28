import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { leagueService, alertService } from '@/_services';

/**
 * AddEdit: Add or Edit a league
 * @param {*} param0 
 * @returns 
 */
function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
    //initial Values for the fields
    const initialValues = {
        leagueName: '',
        rounds: '',
        teamsCount: '',
        substitutionCycle: '',
        publicLeague: 'True',
        leagueMode: 'Create'
    };

    // validation rules
    const validationSchema = Yup.object().shape({
        leagueName: Yup.string()
            .required('Name is required'),
        rounds: Yup.string()
            .required('Rounds is required'),
        teamsCount: Yup.string()
            .required('Max Teams Count is required')
    });

    /**
     * onSubmit: Submit the form. Create or update the league according to the form mode
     * @param {*} fields 
     * @param {*} param1 
     */
    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createLeague(fields, setSubmitting);
        } else {
            updateLeague(id, fields, setSubmitting);
        }
    }
    /**
     * createLeague: submit data to create the league
     * @param {*} fields 
     * @param {*} setSubmitting 
     */
    function createLeague(fields, setSubmitting) {
        leagueService.create(fields)
            .then(() => {
                alertService.success('League added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }
    /**
     * updateLeague: Submit data to update the leauge
     * @param {*} id 
     * @param {*} fields 
     * @param {*} setSubmitting 
     */
    function updateLeague(id, fields, setSubmitting) {
        leagueService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }
    /**
     * Generate HTML for the form
     */
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get league and set form fields
                        leagueService.getById(id).then(league => {
                            const fields = ['leagueName','rounds','teamsCount','substitutionCycle','publicLeague','leagueMode'];
                            fields.forEach(field => setFieldValue(field, league[field], false));
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add League' : 'Edit League'}</h1>
                        <div className="form-row">                    
                            <div className="form-group col-4">
                                <label>League Name</label>
                                <Field name="leagueName" type="text" className={'form-control' + (errors.leagueName && touched.leagueName ? ' is-invalid' : '')} />
                                <ErrorMessage name="leagueName" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-2">
                                <label>Rounds</label>
                                <Field name="rounds" type="text" className={'form-control' + (errors.rounds && touched.rounds ? ' is-invalid' : '')} />
                                <ErrorMessage name="rounds" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-2">
                                <label style={{ whiteSpace: 'nowrap' }}>Max Teams Count</label>
                                <Field name="teamsCount" type="text" className={'form-control' + (errors.teamsCount && touched.teamsCount ? ' is-invalid' : '')} />
                                <ErrorMessage name="teamsCount" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-4">
                                <label>Mode</label>
                                <Field name="leagueMode" type="text" disabled="true" className={'form-control' + (errors.leagueMode && touched.leagueMode ? ' is-invalid' : '')} />
                                <ErrorMessage name="leagueMode" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };