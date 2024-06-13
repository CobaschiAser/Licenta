import React, { useState } from 'react';
import '../css/ResetPassword.css';
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "./AppFooter";
import MyNavbar from "./MyNavbar";
import {jwtDecode} from "jwt-decode";

const SendResetPasswordCodeForm = () => {
    const [currentJwt, setCurrentJwt] = useState( localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [userData, setUserData] = useState({
        email: ''
    });
    const [emptyField, setEmptyField] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [unverified, setUnverified] = useState(false);
    const [success, setSuccess] = useState(false);

    function toggleContinue() {
        window.location.href = '/reset-your-password';
    }

    function toggleVerify() {
        window.location.href = '/verify-email';
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    if (currentJwt !== '') {
        window.location.href = '/home';
        return;
    }
    const handleSendCode = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (userData.email === '' )   {
            setEmptyField(true);
            setInvalidEmail(false);
            setUnverified(false);
            setSuccess(false);
            return;
        }

        try {
            console.log(userData.email);
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/user/send-reset-password-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData.email),
            });
            if (response.ok) {
                // Reset form data
                setUserData({
                    email: ''
                });
                setSuccess(true);
                setInvalidEmail(false);
                setUnverified(false);
            }
            else {
                if (response.status === 401) {
                    setInvalidEmail(true);
                    setUnverified(false);
                    setSuccess(false);
                    console.log("401 Unauthorized");
                }
                if (response.status === 409) {
                    setUnverified(true);
                    setInvalidEmail(false);
                    setSuccess(false);
                    console.log("409 Conflict");
                }

            }
        } catch (error) {
            console.error('Error sending reset password code:', error);
        }
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center" style={{marginBottom: '7vh'}}>
                <Form className="register-form" style={{borderColor: 'black'}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text> <br/></div>}
                    <h2 className="mb-b text-center">Verification Code Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className="form-control"
                            type="email"
                            name="email"
                            placeholder="Enter email to send code"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="text-center">
                        <br/>
                        <Form.Text className="">Already have an account? <a href="/login" style={{color: 'darkslategray'}}>Login now</a></Form.Text>
                        <br/>
                        <br/>
                        <Button variant="secondary" type="button" onClick={handleSendCode} className="submit-button">
                            Send Code
                        </Button>
                        <br/>
                        {invalidEmail && <Form.Text className="text-danger"> Invalid Email Address</Form.Text> }
                        {unverified && <Form.Text className="text-danger"> First, <a href = "/verify-email" onClick={toggleVerify}>verify</a> this email address</Form.Text> }
                        {success && <Form.Text className="success"> Reset password code successfully sent. <a href="/reset-your-password" onClick={toggleContinue}>Continue</a> </Form.Text>}
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default SendResetPasswordCodeForm;
