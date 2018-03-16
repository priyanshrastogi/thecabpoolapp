import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../iconic/css/open-iconic-bootstrap.min.css';
import _ from 'lodash';
import { fetchPoolRequests, sendInterestRequest } from '../actions'

class Home extends Component {

    sendInterestRequest(poolrequestId) {
        this.props.sendInterestRequest(poolrequestId);
    }

    renderInterestedButton(poolrequest) {
        if (poolrequest.interested.indexOf(localStorage.getItem('userId')) === -1 ) {
            return <button className="btn btn-link" onClick={this.sendInterestRequest.bind(this, poolrequest._id)}>Send Interest Request</button>
        }

        else {
            return <button className="btn btn-link" disabled onClick={this.sendInterestRequest.bind(this, poolrequest._id)}>Interested</button>
        }
    }

    renderList() {

        return _.map(this.props.poolrequests, poolrequest => {
            return (
                <li className="list-group-item" key={poolrequest._id}>
                    <div className="collapsed" data-toggle="collapse" data-target={`#${poolrequest._id}`}>
                        {poolrequest.from} <span className="oi oi-arrow-right"></span> {poolrequest.to}<br />
                        {new Date(poolrequest.date.split('T')[0] + " " + poolrequest.date.split('T')[1].split('.')[0] + " UTC").toLocaleString()}<br />
                        <span style={{ fontSize: '12px', color: '#85929E' }}>Posted By {poolrequest.postedBy.name}</span>
                    </div>
                    <div id={poolrequest._id} className="collapse" data-parent="#accordion">{poolrequest.description}<br/>
                    {this.renderInterestedButton(poolrequest)}
                    </div>
                </li>
            );
        }); 

    }

    componentDidMount() {
        if(this.props.authenticated) {
            this.props.fetchPoolRequests();
        }
    }

    render() {

        if(this.props.authenticated) {
            return (
                <div className="text-center container">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#poolreqs" role="tab">Pool Requests</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#notifications" role="tab">Notifications</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="poolreqs" role="tabpanel">
                            <h4 style={{ marginTop: '50px', marginBottom: '50px', fontWeight: 300 }}>Cabpool Requests</h4>
                            <div id="accordion">
                                <div className="card">
                                    <ul className="list-group list-group-flush">
                                        {this.renderList()}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="notifications" role="tabpanel">
                            <h4 style={{ marginTop: '50px', marginBottom: '50px', fontWeight: 300 }}>Notifications</h4>
                        </div>
                    </div>
                </div>
            );
        }

        else {
            return(
                <div className="text-center container">
                    <h4 style={{ marginTop: '150px', fontWeight: 300 }}>Hassle-Free Cab Sharing for Shiv Nadar University</h4>
                    <h5 style={{ fontWeight: 300 }}>Say Bye to Spams and Hello to The Cabpool App</h5>
                    <Link to="/signup" className="btn btn-outline-primary" style={{ marginTop: '20px' }}>Get Started</Link>
                </div>
            );
        }
        
    };
}

function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated, poolrequests: state.poolrequests };
}

export default connect(mapStateToProps, { fetchPoolRequests, sendInterestRequest })(Home);
