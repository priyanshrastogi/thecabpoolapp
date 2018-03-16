import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signOutUser } from '../actions'

class SignOut extends Component {

    componentWillMount() {
        this.props.signOutUser();
    }

    render() {
        return (
            <div className="container text-center">
                <h3 style={{marginTop: '30px', marginBottom:'30px', fontWeight: 300}}>You are Logged Out!</h3>
            </div>
        )
    }

}

export default connect(null, { signOutUser })(SignOut);