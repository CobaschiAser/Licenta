import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import {Link, useHistory} from "react-router-dom";
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container} from "react-bootstrap";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";
const UserView = ({ userId }) => {

    const [error, setError] = useState(false);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        salt: '',
        registrationDate: '',
        requests: '',
        rides: ''
    });

    const redirectToUserRides = () => {
        window.location.href = `/user/${userId}/ride?page=1`;
    };

    const redirectToUserRequests = () => {
        window.location.href = `/user/${userId}/request?page=1`;
    };


    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');


    useEffect(() => {
        if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
            setError(true);
            window.location.href = '/error';
        }

        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])


    useEffect(() => {
        fetch(`http://localhost:2810/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setUserData((prevData) => ({
                    ...prevData, // Keep the existing state
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    salt: data.salt,
                    registrationDate: data.registrationDate,
                    requests: data.requests,
                    rides: data.rides
                }));
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, [userId]);

    if (error) {
        return <div> Error...</div>
    }

    return (
        <div style = {{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <div className="view-form" style={{marginBottom: '7vh', borderColor: 'black'}}>
                    <h2 className="mb-4 text-center">User Profile</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Name:</label>
                        <button>{userData.name}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Email:</label>
                        <button>{userData.email}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Username:</label>
                        <button>{userData.username}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Registration Date:</label>
                        <button>{userData.registrationDate}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Requests:</label>
                        <button>{userData.requests ? userData.requests.length : 0}</button>
                    </div>
                    {userData.requests && userData.requests.length > 0 && (
                        <div className="d-flex justify-content-center">
                            <button  onClick={() => redirectToUserRequests()} className="text-center">
                                View Requests
                            </button>
                        </div>
                    )}
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Rides:</label>
                        <button>{userData.rides ? userData.rides.length : 0}</button>
                    </div>

                    {userData.rides && userData.rides.length > 0 && (
                            <div className="d-flex justify-content-center">
                                <button   onClick={() => redirectToUserRides()} className="text-center">
                                    View Rides
                                </button>
                            </div>
                    )}
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default UserView;