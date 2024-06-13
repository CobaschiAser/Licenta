import React, { useState, useEffect } from 'react';
import '../../css/EditForm.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const EditParkingForm = ({ parkingId }) => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt !== '' && jwt['isAdmin'] === '0') {
            setError(true);
            window.location.href = '/error';
        }

        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])


    const [parkingData, setParkingData] = useState({
        name: '',
        x: '',
        y: '',
        maxCapacity: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [conflictData, setConflictData] = useState(false);
    const [successfullyEdited , setSuccessfullyEdited] = useState(false);

    useEffect(() => {
        fetch(`/parking/byId/${parkingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setParkingData((prevData) => ({
                    ...prevData, // Keep the existing state
                    name: data.name,
                    x: data.x,
                    y: data.y,
                    maxCapacity: data.maxCapacity
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [parkingId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setParkingData({ ...parkingData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (parkingData.name === '' ||
            parkingData.x === '' ||
            parkingData.y === '' ||
            parkingData.maxCapacity === ''
        )   {
            setEmptyField(true);
            setConflictData(false);
            setSuccessfullyEdited(false);
            return;
        }

        try {
            setEmptyField(false);
            const response = await fetch(`http://localhost:2810/parking/${parkingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(parkingData),
            });
            if (response.ok) {
                setSuccessfullyEdited(true);
                // Success - handle the successful creation
                console.log('User created successfully');
                // Reset form data
                setParkingData({
                    name: parkingData.name,
                    x: parkingData.x,
                    y: parkingData.y,
                    maxCapacity: parkingData.maxCapacity
                });
                setConflictData(false);
            }
            else {
                if(response.status === 409) {
                    setConflictData(true);
                    setSuccessfullyEdited(false);
                }
                // Handle error
                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center" style={{flex:1, marginBottom: '7vh'}}>
                <Form className="register-form" style={{borderColor: 'black'}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Edit Parking Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={parkingData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Coordinate X</Form.Label>
                        <Form.Control
                            type="text"
                            name="x"
                            value={parkingData.x}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Coordinate Y</Form.Label>
                        <Form.Control
                            type="text"
                            name="y"
                            value={parkingData.y}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Maximum Capacity</Form.Label>
                        <Form.Control
                            type="text"
                            name="maxCapacity"
                            value={parkingData.maxCapacity}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Button variant="secondary" type="button" onClick={handleSubmit} style={{borderColor: 'black', borderWidth: '2px'}}>
                            Edit Parking
                        </Button>
                        <br/>
                        {successfullyEdited && <Form.Text className="success"> Parking successfully edited</Form.Text> }
                        {conflictData && <Form.Text className="text-danger"> Invalid Name or Coordinates</Form.Text> }
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default EditParkingForm;