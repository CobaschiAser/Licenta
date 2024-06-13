import React, { useState } from 'react';
import '../css/ResetPassword.css';
import AppNavbar from "./AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "./AppFooter";

const ResetPasswordForm = () => {
    const [userData, setUserData] = useState({
        email: '',
        resetPasswordCode: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const [unverified, setUnverified] = useState(false);
    const [undesired, setUndesired] = useState(false);
    const [success, setSuccess] = useState(false);

    function toggleVerify() {
        window.location.href = '/verify-email';
    }
    function toggleLogin() {
        window.location.href = '/login';
    }

    function toggleSendResetPasswordCode() {
        window.location.href = '/send-reset-password-code';
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Check if new password and confirm new password match
        if (userData.newPassword !== userData.confirmNewPassword && userData.newPassword.length !== 0) {
            console.error('Password and Confirm Password do not match');
            return; // Prevent form submission if passwords don't match
        }

        // Check for empty fields
        if (
            userData.email === '' ||
            userData.resetPasswordCode === '' ||
            userData.newPassword === '' ||
            userData.confirmNewPassword === ''
        ) {
            setEmptyField(true);
            setInvalidEmail(false);
            setInvalidCode(false);
            setUnverified(false);
            setUndesired(false);
            setSuccess(false);
            return;
        }

        try {
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/user/reset-password', {
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
                    resetPasswordCode: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
                setSuccess(true);
                setInvalidEmail(false);
                setInvalidCode(false);
                setUndesired(false);
                setUnverified(false);
            }
            else {
                if (response.status === 401) {
                    setInvalidEmail(true);
                    setUnverified(false);
                    setUndesired(false);
                    setInvalidCode(false);
                    setSuccess(false);
                    console.log("401 Unauthorized");
                }
                if (response.status === 405) {
                    setUnverified(true);
                    setInvalidEmail(false);
                    setInvalidCode(false);
                    setUndesired(false);
                    setSuccess(false);
                    console.log("405 Conflict");
                }
                if (response.status === 404) {
                    setUndesired(true);
                    setUnverified(false);
                    setInvalidEmail(false);
                    setInvalidCode(false);
                    setSuccess(false);
                    console.log("404 Not Found");
                }
                if (response.status === 409) {
                    setInvalidCode(true);
                    setUnverified(false);
                    setUndesired(false);
                    setInvalidEmail(false);
                    setSuccess(false);
                    console.log("409 Conflict");
                }

            }
        } catch (error) {
            console.error('Error resetting password code:', error);
        }
    };

    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="register-form">
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text> <br/></div>}
                    <h2 className="mb-b text-center">Reset Password Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email to send code"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Code:</Form.Label>
                        <Form.Control
                            type="string"
                            name="resetPasswordCode"
                            placeholder="Enter reset code received by email"
                            value={userData.resetPasswordCode}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            placeholder="Enter new Password"
                            value={userData.newPassword}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confrim new password"
                            value={userData.confirmNewPassword}
                            onChange={handleChange}
                        />
                    {userData.newPassword !== userData.confirmNewPassword && userData.newPassword.length > 0 && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
                    </Form.Group>
                    <div className="text-center">
                        <br/>
                        <Button variant="primary" type="button" onClick={handleResetPassword}>
                            Reset Password
                        </Button>
                        <br/>
                        {invalidEmail && <Form.Text className="text-danger"> Invalid Email Address</Form.Text> }
                        {unverified && <Form.Text className="text-danger"> First, <a href = "/verify-email" onClick={toggleVerify}>verify</a> this email address</Form.Text> }
                        {undesired && <Form.Text className="text-danger"> You have to <a href = "/send-reset-password-code" onClick={toggleSendResetPasswordCode}>request a code</a> to reset your password</Form.Text>}
                        {success && <Form.Text className="success"> You successfully updated your password. <a href="/login" onClick={toggleLogin}>Login</a> </Form.Text>}
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};
export default ResetPasswordForm;
