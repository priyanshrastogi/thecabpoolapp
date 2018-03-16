import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { connect } from 'react-redux' 

class NavBar extends Component {

    renderNavLinks() {
        if (this.props.authenticated) {
            return (
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item"><Link className="btn btn-outline-success" to="/poolreqs/new">Post A Pool Request</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/signout">Sign Out</Link></li>
                </ul>
            );
        }

        else {
            return (
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
                </ul>
            );
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
                <div className="container">
                    <Link className="navbar-brand" to="/">The Cabpool App</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    {this.renderNavLinks()}
                    </div>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, null)(NavBar)