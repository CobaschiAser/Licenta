import React, { useState, useEffect } from 'react';
import '../../css/EditForm.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const EditVehicleForm = ({ vehicleId }) => {
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

    const [vehicleData, setVehicleData] = useState({
        brand: '',
        model: '',
        seat: '',
        comfort: '',
        fabricationYear: '',
        type: '',
        maxAutonomy: '',
        currentAutonomy: '',
        priceComfort: '',
        priceTime: '',
        priceDistance: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyEdited, setSuccessfullyEdited] = useState(false);
    const [conflict, setConflict] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:2810/vehicle/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setVehicleData((prevData) => ({
                    ...prevData, // Keep the existing state
                    brand: data.brand,
                    model: data.model,
                    seat: data.seat,
                    comfort: data.comfort,
                    fabricationYear: data.fabricationYear,
                    type: data.type,
                    maxAutonomy: data.maxAutonomy,
                    currentAutonomy: data.currentAutonomy,
                    priceComfort: data.priceComfort,
                    priceTime: data.priceTime,
                    priceDistance: data.priceDistance
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [vehicleId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({ ...vehicleData, [name]: value });
    };

    const handleSubmit = (e) => {

        if (
            vehicleData.priceDistance === '' ||
            vehicleData.priceComfort === '' ||
            vehicleData.priceTime === ''
        ) {
            setEmptyField(true);
            setSuccessfullyEdited(false);
            setConflict(false);
            return;
        }


        e.preventDefault();
        // Send updated parkingData to backend for modification
        fetch(`/vehicle/${vehicleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(vehicleData),
        })
            .then((response) => {
                // Handle response if needed
                setSuccessfullyEdited(true);
                setEmptyField(false);
                setConflict(false);
            })
            .catch((error) => {
                setSuccessfullyEdited(false);
                setEmptyField(false);
                setConflict(true);
                console.error('Error updating parking:', error);
            });
    };

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{minHeight:'100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="register-form" style={{borderColor:'black', marginBottom: '7vh'}}>
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Edit Vehicle Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Time Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceTime"
                            value={vehicleData.priceTime}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Comfort Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceComfort"
                            value={vehicleData.priceComfort}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Distance Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceDistance"
                            value={vehicleData.priceDistance}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Button variant="secondary" type="button" onClick={handleSubmit}>
                            Edit Vehicle
                        </Button>
                        <br/>
                        {successfullyEdited && <Form.Text className="success"> Vehicle successfully edited</Form.Text> }
                        {conflict && <Form.Text className="text-danger"> Error. Please try again</Form.Text> }
                    </div>
                </Form>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default EditVehicleForm;