import React, { useState } from 'react';
import AppNavbar from "../navbar_footer/AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "../navbar_footer/AppFooter";
import MyNavbar from "../navbar_footer/MyNavbar";

const VerifyEmailForm = () => {
    const [userData, setUserData] = useState({
        email: '',
        verificationCode: ''
    });
    const [emptyField, setEmptyField] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const [successfullyVerified, setSuccessfullyVerified] = useState(false);
    const [alreadyVerified , setAlreadyVerified] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    function toggleLogin() {
        window.location.href = '/login';
    }

    const handleSend = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (
            userData.email === '' ||
            userData.verificationCode === ''
        ) {
            setEmptyField(true);
            setAlreadyVerified(false);
            setSuccessfullyVerified(false);
            setInvalidEmail(false);
            setInvalidCode(false);
            return;
        }

        try {
            console.log(userData);
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/user/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                // Reset form data
                setUserData({
                    email: '',
                    verificationCode: ''
                });
                setSuccessfullyVerified(true);
                setAlreadyVerified(false);
                setInvalidEmail(false);
                setInvalidCode(false);
            }
            else {
                setSuccessfullyVerified(false);
                if (response.status === 401) {
                    setInvalidEmail(true);
                    setInvalidCode(false);
                    setAlreadyVerified(false);
                    // Handle error
                    console.error('No user with given email');

                }

                if (response.status === 404) {
                    setInvalidCode(true);
                    setInvalidEmail(false);
                    setAlreadyVerified(false);
                    console.error('Incorrect verification code for given email');
                }

                if (response.status === 409) {
                    setInvalidCode(false);
                    setInvalidEmail(false);
                    setAlreadyVerified(true);
                    console.error('This email was already verified');
                }
            }
        } catch (error) {
            console.error('Error verifying email: ', error);
        }
    };

    return (
        <div style = {{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container style={{marginBottom: '7vh'}} className="mt-5 d-flex justify-content-center">
                <Form className="register-form"  style={{ borderColor: "black"}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text> <br/></div>}
                    <h2 className="mb-b text-center">Verification Email Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email you created account with"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicName">
                        <Form.Label>Verification code</Form.Label>
                        <Form.Control
                            type="text"
                            name="verificationCode"
                            placeholder="Enter code sent by email"
                            value={userData.verificationCode}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="text-center">
                        <br/>
                        <Button variant="secondary" type="button"  style={{borderColor: "black", borderWidth: '2px'}} onClick={handleSend}>
                            Verify Email
                        </Button>
                        <br/>
                        {invalidEmail && <Form.Text className="text-danger"> No account with given email</Form.Text> }
                        {invalidCode && <Form.Text className="text-danger"> Incorrect verification code</Form.Text> }
                        {alreadyVerified && <Form.Text className="success"> Email already verified <a href = "/Login" onClick={toggleLogin}> Login now</a></Form.Text>}
                        {successfullyVerified && <Form.Text className="success"> Email successfully verified. <a href = "/Login" onClick={toggleLogin}> Login now</a></Form.Text>}
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default VerifyEmailForm;
