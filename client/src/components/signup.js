import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';

class Login extends Component {

    renderField(field) {

        const fieldClass = `form-control ${field.meta.touched && field.meta.error ? 'is-invalid' : ''}`

        return (
            <div className="form-group">
                <input className={fieldClass} type="text" {...field.input} placeholder={field.label}/>
                <div className="invalid-feedback">{field.meta.touched ? field.meta.error : ''}</div>
            </div>
            //If field is touched, only then show the error message.
        );
    }

    onSubmit(values) {
    };

    render() {

        const { handleSubmit } = this.props //property added by Redux Form to handle form submit.

        return (
            <div className="container text-center">
                <h3 style={{marginTop: '30px', marginBottom:'30px', fontWeight: 300}}>Sign Up</h3>
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Field name="name" component={this.renderField} label="Name" />
                    <Field name="username" component={this.renderField} label="Email" />
                    <Field name="phone" component={this.renderField} label="Phone" />
                    <Field name="password" component={this.renderField} label="Password" />
                    <p style={{ fontSize: '12px' }}>By Signing up, You agree to Terms and Conditions for using The Cabpool App.</p>
                    <button className="btn btn-primary" type="submit">Sign Up</button>
                    <p style={{marginTop: '20px'}}>Already have an Account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        );
    };
}

function validate(values) {
    const errors = {};

    if (!values.name) {
        errors.name = 'Name cannot be empty';
    }

    if (!values.username) {
        errors.username = 'Email cannot be empty';
    }

    if (!values.phone) {
        errors.phone = 'Phone cannot be empty';
    }

    if (!values.password) {
        errors.password = 'Password cannot be empty';
    }

    return errors
}

export default reduxForm({ validate: validate, form: 'SignUpForm' })(Login);