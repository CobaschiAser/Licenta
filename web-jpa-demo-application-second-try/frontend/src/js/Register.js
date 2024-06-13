import React, { useState } from 'react';
import '../css/Register.css';
import AppNavbar from "./AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "./AppFooter";
import MyNavbar from "./MyNavbar";
import {jwtDecode} from "jwt-decode";

const RegisterForm = () => {

    const [currentJwt, setCurrentJwt] = useState( localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [invalidEmailOrUsername, setInvalidEmailOrUsername] = useState(false);
    const [emptyField, setEmptyField] = useState(false);

    const [nameError, setNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const sanitizeUserInput = (userInput) => {
        return userInput.replace(/[;\/\\]/g, '\\$&'); // Escape spaces, semicolons, forward slashes, and backslashes
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'name') {
            if (name === 'username'){
                if (value.includes(' ')) {
                    setUsernameError("Username cannot contain spaces");
                } else {
                    setUsernameError('');
                }
            } else if (name === 'email') {
                if (!value.includes('@') || !(value.endsWith(".com") || value.endsWith(".ro"))) {
                    setEmailError("Invalid email address");
                } else {
                    setEmailError('');
                }
            }
            setUserData({...userData, [name]: value});
        } else {
            if (value.includes(' ')) {
                setNameError("Name cannot contain spaces");
            } else {
                setNameError('');
            }
            setUserData({...userData, [name]: value});
        }
    };

    if (currentJwt !== '') {
        window.location.href = '/home';
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if password and confirm password match
        if (userData.password !== userData.confirmPassword && userData.password.length !== 0) {
            console.error('Password and Confirm Password do not match');
            return; // Prevent form submission if passwords don't match
        }

        // check for error in name, username, email

        if (nameError !== '' ||
            usernameError !== '' ||
            emailError !== ''
        )   {
            return;
        }

        // Check for empty fields
        if (userData.name === '' ||
            userData.email === '' ||
            userData.username === '' ||
            userData.password === '' ||
            userData.confirmPassword === ''
        )   {
            setEmptyField(true);
            setInvalidEmailOrUsername(false);
            setSuccessfullyCreated(false);
            return;
        }

        try {
            console.log(userData);
            setEmptyField(false);
            setUserData({...userData, ["name"]: sanitizeUserInput(userData.name)});
            setUserData({...userData, ["username"]: sanitizeUserInput(userData.username)});
            setUserData({...userData, ["email"]: sanitizeUserInput(userData.email)});
            const response = await fetch('http://localhost:2810/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setSuccessfullyCreated(true);
                // Success - handle the successful creation
                console.log('User created successfully');
                // Reset form data
                setUserData({
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: ''
                });
                setInvalidEmailOrUsername(false);
            }
            else {
                if(response.status === 409) {
                    setInvalidEmailOrUsername(true);
                    setSuccessfullyCreated(false);
                }
                // Handle error
                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div style = {{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container style={{marginBottom: '7vh'}} className="mt-5 d-flex justify-content-center">
                <Form className="register-form" style={{ borderColor: "black"}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Register</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control className="register-control-form"
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={userData.name}
                            onChange={handleChange}
                            isInvalid={nameError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className="register-control-form"
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={userData.email}
                            onChange={handleChange}
                            isInvalid={emailError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control className="register-control-form"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={userData.username}
                            onChange={handleChange}
                            isInvalid={usernameError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control className="register-control-form"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={userData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control className="register-control-form"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={userData.confirmPassword}
                            onChange={handleChange}
                        />
                        {userData.password !== userData.confirmPassword && userData.password.length > 0 && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Form.Text className="">Already have an account? <a href="/login" style={{color: 'darkslategray'}}>Login now</a></Form.Text>
                        <br/>
                        <br/>
                        <Button variant="secondary" type="button" style={{borderColor: "black", borderWidth: '2px'}} onClick={handleSubmit}>
                            Create Account
                        </Button>
                        <br/>
                        {successfullyCreated && <Form.Text className="success"> User successfully created</Form.Text> }
                        {invalidEmailOrUsername && <Form.Text className="text-danger"> Invalid Username or Email Address</Form.Text> }
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default RegisterForm;
