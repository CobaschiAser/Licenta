import React, {useEffect, useState} from 'react';
import '../../css/CreateForm.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import Footer from "../AppFooter";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const NewParkingForm = () => {

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
        x:'',
        y:'',
        maxCapacity:''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [conflictData, setConflictData] = useState(false);
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
            setSuccessfullyCreated(false);
            setConflictData(false);
            return;
        }

        try {
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/parking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(parkingData),
            });
            if (response.ok) {
                // Success - handle the successful creation
                console.log('Parking created successfully');
                // Reset form data
                setParkingData({
                    name: '',
                    x:'',
                    y:'',
                    maxCapacity:'',
                });
                setSuccessfullyCreated(true);
                setConflictData(false);
            } else {
                setSuccessfullyCreated(false);
                if(response.status === 409){
                    setConflictData(true);
                }
                // Handle error
                console.error('Failed to create parking');
            }
        } catch (error) {
            console.error('Error creating parking:', error);
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
                <Container className="mt-5 d-flex justify-content-center" style={{flex:1, marginBottom:"7vh"}}>
                    <Form className="create-form" style={{borderColor: 'black'}}>
                        {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                        <br/>
                        <h2 className="mb-b text-center">Create Parking Form</h2>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                value={parkingData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Coordinate X</Form.Label>
                            <Form.Control
                                type="text"
                                name="x"
                                placeholder="Enter x"
                                value={parkingData.x}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Coordinate y</Form.Label>
                            <Form.Control
                                type="text"
                                name="y"
                                placeholder="Enter y"
                                value={parkingData.y}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Maximum Capacity</Form.Label>
                            <Form.Control
                                type="text"
                                name="maxCapacity"
                                placeholder="Enter max capacity"
                                value={parkingData.maxCapacity}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <br/>
                        <div className="text-center">
                            <Button variant="secondary" type="button" onClick={handleSubmit} style={{borderColor: 'black', borderWidth: '2px'}}>
                                Create Parking
                            </Button>
                            <br/>
                            {successfullyCreated && <Form.Text className="success"> Parking successfully created</Form.Text> }
                            {conflictData && <Form.Text className="text-danger"> Invalid Name or Coordinates</Form.Text> }
                        </div>
                    </Form>
                </Container>
                <AppFooter/>
            </div>
    );
};

export default NewParkingForm;