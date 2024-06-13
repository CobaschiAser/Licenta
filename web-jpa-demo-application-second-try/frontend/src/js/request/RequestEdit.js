import React, { useState, useEffect } from 'react';
import '../../css/EditForm.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AppFooter from "../AppFooter";
import MyNavbar from "../MyNavbar";
import {jwtDecode} from "jwt-decode";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";

const EditRequestForm = ({ requestId , userId}) => {

    const [invalidRequest, setInvalidRequest] = useState(false);

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [requestData, setRequestData] = useState({
        date: '',
        departure: '',
        arrival: '',
        startHour: '',
        endHour: '',
        vehicleType: '',
        vehicleId: ''
    });

    if (jwt === '') {
        window.location.href = '/login';
    }

    console.log(requestData);

    if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
        window.location.href = '/error';
    }

    const [initialVehicleId, setInitialVehicleId] = useState(0);

    const [emptyField, setEmptyField] = useState(false);
    const [conflictData, setConflictData] = useState(false);
    const [successfullyEdited , setSuccessfullyEdited] = useState(false);
    const [validStartHour, setValidStartHour] = useState(true);
    const [validEndHour, setValidEndHour] = useState(true);
    const [parkings, setParkings] = useState([]);
    const [validDeparture, setValidDeparture] = useState(true);
    const [validArrival, setValidArrival] = useState(true);
    const [vehicles, setVehicles] = useState([]);

    const [selectedParking, setSelectedParking] = useState(null);
    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });

    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }

    useEffect(() => {
        async function fetchParkings() {
            try {
                const response = await fetch(`/parking`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setParkings(data);
                } else {
                    console.error('Failed to fetch parkings');
                }
            } catch (error) {
                console.error('Error fetching parkings:', error);
            }
        }

        fetchParkings();
    }, []);

    const handleSelectVehicle = async (e) => {
        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.startHour === '' ||
            requestData.vehicleType === ''
        ) {
            return;
        }
        try {
            // console.log(requestData.date);
            const url = `/vehicle/available-in-departure-update?date=${requestData.date}&departure=${requestData.departure}&startHour=${requestData.startHour}&initialVehicleId=${requestData.vehicleId}&vehicleType=${requestData.vehicleType}`;
            // console.log(localStorage.getItem('jwt'));
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setVehicles(data);
            } else {
                console.error('Failed to fetch vehicles');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }


    const handleDateChange = (date) => {
        setRequestData({ ...requestData, date });
        console.log(requestData.date);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData({ ...requestData, [name]: value });

        // validate Departure
        if (name === "departure") {
            console.log(value);
            if (value === requestData.arrival) {
                setValidDeparture(false);
                return;
            } else {
                setValidDeparture(true);
            }
        }
        // validate Arrival
        if (name === "arrival") {
            if (value === requestData.departure) {
                setValidArrival(false);
                return;
            } else {
                setValidArrival(true);
            }
        }

        // Validate startHour
        if (name === "startHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) >= parseInt(requestData.endHour)) {
                console.error("Invalid start hour. Please enter a number between 0 and 23.");
                setValidStartHour(false);
                return;
            } else{
                setValidStartHour(true);
            }
        }
        if (name === "endHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) <= parseInt(requestData.startHour)) {
                setValidEndHour(false);
            } else{
                setValidEndHour(true);
            }
        }
    };


    useEffect(() => {

        fetch(`/request/${requestId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setRequestData((prevData) => ({
                    ...prevData, // Keep the existing state
                    date: data.date,
                    departure: data.departure,
                    arrival: data.arrival,
                    startHour: data.startHour,
                    endHour: data.endHour,
                    vehicleType: data.vehicleType,
                    vehicleId: data.vehicleId,
                    owner: data.owner
                }));

                setInitialVehicleId(data.vehicleId);
            })
            .catch((error) => {
                setInvalidRequest(true);
                console.error('Error fetching request details:', error);
            });
    }, [requestId]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validStartHour || !validEndHour) {
            return;
        }
        // Check for empty fields
        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.arrival === '' ||
            requestData.startHour === '' ||
            requestData.endHour === '' ||
            requestData.vehicleId === ''
        ){
            setEmptyField(true);
            setConflictData(false);
            setSuccessfullyEdited(false);
            return;
        }

        try {
            setEmptyField(false);
            // console.log(localStorage.getItem('jwt'));
            const response = await fetch(`http://localhost:2810/request/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(requestData),
            });
            if (response.ok) {
                setSuccessfullyEdited(true);
                // Success - handle the successful creation
                console.log('User created successfully');
                // Reset form data
                setRequestData({
                    date: requestData.date,
                    departure: requestData.departure,
                    arrival: requestData.arrival,
                    startHour: requestData.startHour,
                    endHour: requestData.endHour,
                    vehicleType: requestData.vehicleType,
                    vehicleId: requestData.vehicleId
                });
                setConflictData(false);
            }
            else {
                if(response.status === 409) {
                    setConflictData(true);
                    setSuccessfullyEdited(false);
                }
                // Handle error
                console.error('Failed to update request');
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    useEffect( () => {
        if (invalidRequest) {
            window.location.href = '/error';
        }
    }, [invalidRequest])

    if (invalidRequest) {
        return(
            <div>Error..</div>
        )
    }

    if (!isLoaded) {
        return (
            <div>
                Loading..
            </div>
        )
    }

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center" style={{marginBottom: '7vh'}}>
                <div>
                    <Form className="register-form" style={{borderColor: 'black'}}>
                        {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                        <br/>
                        <h2 className="mb-b text-center">Edit Request Form</h2>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Date</Form.Label>
                            <br/>
                            <DatePicker
                                selected={requestData.date}
                                onChange={handleDateChange}
                                className="form-control"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Departure</Form.Label>
                            <Form.Control
                                as="select"
                                name="departure"
                                value={requestData.departure}
                                onChange={handleChange}
                            >
                                <option value="">Select Departure</option>
                                {parkings.map(parking => (
                                    <option key={parking.id} value={parking.name}>{parking.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {!validDeparture && <div className="text-center"><Form.Text className="text-danger" > Departure must be different than Arrival</Form.Text></div>}
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Arrival</Form.Label>
                            <Form.Control
                                as="select"
                                name="arrival"
                                value={requestData.arrival}
                                onChange={handleChange}
                            >
                                <option value="">Select Arrival</option>
                                {parkings.map(parking => (
                                    <option key={parking.id} value={parking.name}>{parking.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {!validArrival && <div className="text-center"><Form.Text className="text-danger" > Arrival must be different than Departure</Form.Text></div>}

                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Start Hour</Form.Label>
                            <Form.Control
                                type="number"
                                name="startHour"
                                placeholder="Enter start hour"
                                value={requestData.startHour}
                                onChange={handleChange}
                                min="0"
                                max="23"
                            />
                        </Form.Group>
                        {!validStartHour && <div className="text-center"><Form.Text className="text-danger" > Invalid start hour</Form.Text></div>}
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>End Hour</Form.Label>
                            <Form.Control
                                type="number"
                                name="endHour"
                                placeholder="Enter end hour"
                                value={requestData.endHour}
                                onChange={handleChange}
                                min="0"
                                max="23"
                            />
                        </Form.Group>
                        {!validEndHour && <div className="text-center"><Form.Text className="text-danger" > Invalid end hour.</Form.Text></div>}
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="vehicleType"
                                value={requestData.vehicleType}
                                onChange={handleChange}
                            >
                                <option value="">Select Vehicle Type</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Berlina"> Berlina </option>
                                <option value="Break"> Break </option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Vehicle</Form.Label>
                            <Form.Control
                                as="select"
                                name="vehicleId"
                                value={requestData.vehicleId}
                                onChange={handleChange}
                                onClick={handleSelectVehicle}
                            >
                                <option value="">Select Vehicle</option>
                                {vehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.id}>{vehicle.numberPlate}->{vehicle.brand} {vehicle.model}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <br/>
                        <div className="text-center">
                            <Button variant="secondary" type="button" onClick={handleSubmit}>
                                Edit Request
                            </Button>
                            <br/>
                            {successfullyEdited && <Form.Text className="success"> Request successfully edited</Form.Text> }
                            {conflictData && <Form.Text className="text-danger"> Impossible to edit this request</Form.Text> }
                        </div>
                    </Form>
                </div>
                <div style={{ display: 'flex', flex: 2, position: 'relative'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', overflow: 'hidden' }}>
                        <GoogleMap center={center} zoom={12} mapContainerStyle={{width: '75%', height: '75%', border: '3px solid black', overflow: 'hidden' }}>
                            {parkings.map(parking => (
                                <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                            ))}
                            {selectedParking && (
                                <InfoWindow
                                    position={{ lat: selectedParking.x, lng: selectedParking.y }}
                                    onCloseClick={() => setSelectedParking(null)}
                                >
                                    <div>
                                        <p>{selectedParking.name}</p>
                                        <p>Current capacity: {selectedParking.currentCapacity}</p>
                                        <p>Max capacity: {selectedParking.maxCapacity}</p>
                                        {selectedParking.vehicles.length !== 0 && <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={() => handleViewParkingVehicles(selectedParking.id)}>
                                            View Vehicles
                                        </Button>}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default EditRequestForm;