import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { loginUser } from '../actions';

class Login extends Component {

    renderField(field) {

        const fieldClass = `form-control ${field.meta.touched && field.meta.error ? 'is-invalid' : ''}`

        return (
            <div className="form-group">
                <input className={fieldClass} type={field.type} {...field.input} placeholder={field.label}/>
                <div className="invalid-feedback">{field.meta.touched ? field.meta.error : ''}</div>
            </div>
            //If field is touched, only then show the error message.
        );
    }

    onSubmit(cred) {
        this.props.loginUser(cred, () => this.props.history.push('/') );
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
                <h3 style={{marginTop: '30px', marginBottom:'30px', fontWeight: 300}}>Login</h3>
                {this.renderErrorAlert()}
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Field name="username" component={this.renderField} label="Email" type="text"/>
                    <Field name="password" component={this.renderField} label="Password" type="password"/>
                    <button className="btn btn-primary" type="submit">Login</button>
                    <p style={{marginTop: '20px'}}><Link to="/forgotpassword">Forgot Password?</Link></p>
                    <p>Don't have an account yet? <Link to="/signup">Sign Up</Link></p>
                </form>
            </div>
        );
    };
}

function validate(values) {
    const errors = {};

    if (!values.username) {
        errors.username = 'Email cannot be empty.';
    }

    if (!values.password) {
        errors.password = 'Password cannot be empty.';
    }

    return errors
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

export default reduxForm({ validate: validate, form: 'LoginForm' })(connect(mapStateToProps, { loginUser })(Login));