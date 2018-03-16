import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { postPoolRequest } from '../actions';

class NewPoolRequest extends Component {

    renderField(field) {

        const fieldClass = `form-control ${field.meta.touched && field.meta.error ? 'is-invalid' : ''}`

        return (
            <div className="form-group">
                <label>{field.label}</label>
                <input className={fieldClass} type={field.type} {...field.input} placeholder={field.placeholder} />
                <div className="invalid-feedback">{field.meta.touched ? field.meta.error : ''}</div>
            </div>
            //If field is touched, only then show the error message.
        );
    }

    onSubmit(values) {
        values.date = new Date(values.date).toISOString();
        //console.log(values);
        this.props.postPoolRequest(values, () => this.props.history.push('/'));
    };

    renderErrorAlert() {
        if (this.props.errorMessage) {
            return (
                <div>
                    <p className="alert alert-danger">{this.props.errorMessage}</p>
                </div>
            )
        }
    }

    render() {

        const { handleSubmit } = this.props //property added by Redux Form to handle form submit.

        return (
            <div className="container text-center">
                <h3 style={{ marginTop: '30px', marginBottom: '30px', fontWeight: 300 }}>Post A Pool Request</h3>
                {/* {this.renderErrorAlert()} */}
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Field name="from" component={this.renderField} label="From" type="text" />
                    <Field name="to" component={this.renderField} label="To" type="text" />
                    <Field name="date" component={this.renderField} label="Date and Time" type="datetime-local" />
                    <Field name="description" component={this.renderField} label="Description" placeholder="Optional" type="textarea" />
                    <button className="btn btn-primary" type="submit" style={{marginRight: '10px', marginTop: '25px'}}>Submit</button>
                    <Link to="/" className="btn btn-danger" style={{ marginTop: '25px' }}>Cancel</Link>
                </form>
            </div>
        );
    };
}

function validate(values) {
    const errors = {};

    if (!values.from) {
        errors.from = 'Please fill out From location.';
    }

    if (!values.to) {
        errors.password = 'Please fill out To location.';
    }

    if (!values.date) {
        errors.date = 'Please fill out date and time.';
    }


    return errors
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

export default reduxForm({ validate: validate, form: 'createPoolRequestForm' })(connect(mapStateToProps, {postPoolRequest})(NewPoolRequest));