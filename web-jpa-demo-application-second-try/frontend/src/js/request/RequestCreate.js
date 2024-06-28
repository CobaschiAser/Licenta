import React, {useEffect, useState} from 'react';
import '../../css/CreateForm.css';
import {Button, Container, Form, FormLabel} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AppFooter from "../navbar_footer/AppFooter";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../navbar_footer/MyNavbar";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
const NewRequestForm = ({userId}) => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    if (jwt === '') {
        window.location.href = '/login';
    }

    if (jwt !== '' && jwt['uuid'] !== userId) {
        window.location.href = '/error';
    }
    // console.log(jwt);

    const [requestData, setRequestData] = useState({
        date: '',
        departure: '',
        arrival: '',
        startHour: '',
        endHour: '',
        vehicleType: '',
        vehicleId: ''
    });

    const [preferenceData, setPreferenceData] = useState({
        id: '',
        departure: '',
        arrival: '',
        vehicleType: '',
        userUUID: ''
    });

    const [usePreference, setUsePreference] = useState(false);

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [validStartHour, setValidStartHour] = useState(true);
    const [validEndHour, setValidEndHour] = useState(true);
    const [parkings, setParkings] = useState([]);
    const [validDeparture, setValidDeparture] = useState(true);
    const [validArrival, setValidArrival] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [selectedParking, setSelectedParking] = useState(null);


    const [estimatedPrice, setEstimatedPrice] = useState(0);

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
                //console.error('Error fetching parkings:', error);
            }
        }

        fetchParkings();
    }, []);

    useEffect(() => {
        async function fetchPreference() {
            try {
                const response = await fetch(`/preference/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPreferenceData(data);
                } else {
                    console.log('Failed to fetch preference');
                }
            } catch (error) {
                //console.error('Error fetching preference:', error);
            }
        }

        fetchPreference();
    }, []);

    useEffect(() => {
        async function fetchEstimatedPrice() {
            try {

                if( requestData.date === '' ||
                    requestData.departure === '' ||
                    requestData.arrival === '' ||
                    requestData.startHour === '' ||
                    requestData.endHour === '' ||
                    requestData.vehicleType === '' ||
                    requestData.vehicleId === ''
                ) return;

                const response = await fetch(`http://localhost:2810/ride/estimate-price`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    },
                    body: JSON.stringify(requestData),
                });
                if (response.ok) {
                    console.log('success');
                    const data = await response.json();
                    setEstimatedPrice(data);
                    console.log(data);
                } else {
                    setEstimatedPrice(0);
                    console.log('Failed to fetch estimated price');
                }
            } catch (error) {
                console.error('Error fetching estimated price:', error);
            }
        }

        fetchEstimatedPrice();
    }, [requestData]);



    const handleSelectVehicle = async (e) => {
        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.startHour === '' ||
            requestData.vehicleType === ''
        ) {
            return;
        }
        try {
            console.log(requestData.date);
            const url = `/vehicle/available-in-departure?date=${requestData.date}&departure=${requestData.departure}&startHour=${requestData.startHour}&vehicleType=${requestData.vehicleType}`;
            console.log(url);
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
                if (data.length === 0) {
                    setRequestData({ ...requestData, vehicleId: '' })
                    setEstimatedPrice(0);
                }
                if (requestData.vehicleId === ''){
                    setEstimatedPrice(0);
                }
                setVehicles(data);
            } else {
                console.error('Failed to fetch vehicles');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        console.log(formattedDate);
        setRequestData({ ...requestData, date: formattedDate });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData({ ...requestData, [name]: value });
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
        // Validate star hour
        if (name === "startHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) >= parseInt(requestData.endHour)) {
                console.error("Invalid start hour. Please enter a number between 0 and 23.");
                setValidStartHour(false);
                return;
            } else{
                setValidStartHour(true);
            }
        }
        // validate end hour
        if (name === "endHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) <= parseInt(requestData.startHour)) {
                setValidEndHour(false);
            } else{
                setValidEndHour(true);
            }
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validStartHour || !validEndHour) {
            return;
        }

        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.arrival === '' ||
            requestData.startHour === '' ||
            requestData.endHour === '' ||
            requestData.vehicleType === '' ||
            requestData.vehicleId === ''
        ){
            setEmptyField(true);
            setSuccessfullyCreated(false);
            return;
        }


        try {

            const response = await fetch(`http://localhost:2810/request/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setSuccessfullyCreated(true);
                setEmptyField(false);
                // Success - handle the successful creation
                console.log('Request created successfully');
                // Reset form data
                setRequestData({
                    date: '',
                    departure: '',
                    arrival: '',
                    startHour: '',
                    endHour: '',
                    vehicleType: '',
                    vehicleId: ''
                });
                setEstimatedPrice(0);
            } else {
                // Handle error
                console.error(response.status);
            }
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    console.log(estimatedPrice);


    if (!isLoaded) {
        return (
            <div>Loading..</div>
        )
    }

    return (
        <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <div>
                    <Form className="create-form" style={{marginBottom: '7vh', borderColor: 'black'}}>
                        {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                        <br/>
                        <h2 className="mb-b text-center">Create Request Form</h2>
                        <FormCheckLabel>
                            <Form.Check
                                type="checkbox"
                                label="Use Preference"
                                checked={usePreference}
                                onChange={(e) => setUsePreference(e.target.checked)}
                            />
                        </FormCheckLabel>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Date</Form.Label>
                            <br/>
                            <DatePicker
                                selected={requestData.date}
                                onChange={handleDateChange}
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicDeparture">
                            <Form.Label>Departure</Form.Label>
                            <Form.Control
                                as="select"
                                name="departure"
                                value={requestData.departure}
                                onChange={handleChange}
                                onClick={handleSelectVehicle}
                            >
                                <option value={(preferenceData.departure && usePreference) ? preferenceData.departure : ""}>{(usePreference && preferenceData.departure) ? preferenceData.departure :"Select Departure"}</option>
                                {parkings.map(parking => (
                                    (usePreference && preferenceData && parking.name === preferenceData.departure) ? null :
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
                                onClick={handleSelectVehicle}

                            >
                                <option value={(preferenceData.arrival && usePreference) ? preferenceData.arrival : ""}>{(preferenceData.arrival && usePreference) ? preferenceData.arrival : "Select Arrival"}</option>
                                {parkings.map(parking => (
                                    (usePreference && preferenceData && parking.name === preferenceData.arrival) ? null :
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
                                onClick={handleSelectVehicle}
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
                                onClick={handleSelectVehicle}
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
                                onClick={handleSelectVehicle}
                            >
                                <option value={(preferenceData.vehicleType && usePreference) ? preferenceData.vehicleType : ""}>{(preferenceData.vehicleType  && usePreference) ? preferenceData.vehicleType : "Select Vehicle Type"}</option>
                                {(usePreference && preferenceData.vehicleType && "Sedan" === preferenceData.vehicleType) ? null : <option value="Sedan">Sedan</option>}
                                {(usePreference && preferenceData.vehicleType && "SUV" === preferenceData.vehicleType) ? null :<option value="SUV">SUV</option>}
                                {(usePreference && preferenceData.vehicleType && "Berlina" === preferenceData.vehicleType) ? null :<option value="Berlina"> Berlina </option>}
                                {(usePreference && preferenceData.vehicleType && "Break" === preferenceData.vehicleType) ? null :<option value="Break"> Break </option>}
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
                                    <option
                                        key={vehicle.id}
                                        value={vehicle.id}
                                        //title={`Estimated price: ${estimatedPrice}`}
                                    >
                                        {vehicle.numberPlate} ({vehicle.brand} {vehicle.model})
                                    </option>
                                ))}
                                </Form.Control>
                            {estimatedPrice > 0 && <div style={{textAlign: "center", marginTop: '2vh'}}>Estimated Price: {estimatedPrice.toFixed(2)}</div>}
                        </Form.Group>

                        <br/>
                        <div className="text-center">
                            <Button variant="secondary" type="button" onClick={handleSubmit}>
                                Create Request
                            </Button>
                            <br/>
                            {successfullyCreated && <Form.Text className="success"> Request successfully created</Form.Text> }
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

export default NewRequestForm;