import React, { useState, useEffect } from 'react';
import '../../css/EditForm.css';
import App from "../../App";
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const EditUserForm = ({ userId }) => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

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

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: ''
    });

    const[emptyField, setEmptyField] = useState(false);
    const[conflictData, setConflictData] = useState(false);
    const[successfullyEdited, setSuccessfullyEdited] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:2810/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Selectively update the state based on fetched data
                setUserData((prevData) => ({
                    ...prevData, // Keep the existing state
                    name: data.name,
                    email: data.email,
                    username: data.username
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [userId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check for empty Fields
        if (userData.name === '' ||
            userData.email === '' ||
            userData.username === ''
        ) {
            setEmptyField(true);
            setConflictData(false);
            setSuccessfullyEdited(false);
            return;
        }

        try {
            setEmptyField(false);
            const response = await fetch(`http://localhost:2810/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setSuccessfullyEdited(true);
                // Success - handle the successful creation
                console.log('User edited successfully');
                // Reset form data
                setUserData({
                    name: userData.name,
                    email: userData.email,
                    username: userData.username
                });
                setConflictData(false);
            } else {
                if (response.status === 409) {
                    setConflictData(true);
                    setSuccessfullyEdited(false);
                }
                // Handle error
                console.error('Failed to edit user');
            }
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    if (error) {
        return <div> Error...</div>
    }
    return (
        <div style={{minHeight:'100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="register-form" style={{marginBottom: '7vh', borderColor: 'black'}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Edit User Profile</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Button variant="secondary" type="button" onClick={handleSubmit} style={{borderColor:'black', borderWidth: '2px'}}>
                            Edit
                        </Button>
                        <br/>
                        {successfullyEdited && <Form.Text className="success"> User successfully edited</Form.Text> }
                        {conflictData && <Form.Text className="text-danger"> Invalid Username or Email Address</Form.Text> }
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default EditUserForm;