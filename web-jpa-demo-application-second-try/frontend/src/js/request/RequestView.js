import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
const RequestView = ({ requestId , userId}) => {

    const [error, setError] = useState(false);

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    if (jwt === '') {
        window.location.href = '/login';
    }

    if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
        setError(true);
        window.location.href = '/error';
    }
    // console.log(jwt);


    const [requestData, setRequestData] = useState({
        date: '',
        departure: '',
        arrival:'',
        startHour:'',
        endHour:'',
        vehicleId:'',
        started: '',
        solved: '',
        owner: ''
    });


    const [arrivalParking, setArrivalParking] = useState(null);
    const [departureParking, setDepartureParking] = useState(null);

    const [selectedParking, setSelectedParking] = useState(null);

    const [parkings, setParkings] = useState([]);

    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });

    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }

    const handleStartRequest = async (e) => {
        e.preventDefault();
        console.log("am dat start");

        try {
            console.log("am dat start");
            const response = await fetch(`http://localhost:2810/request/${requestId}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });

            if (response.ok) {
                /*setSuccessfullyCreated(true);
                setEmptyField(false);
                // Success - handle the successful creation
                console.log('Request created successfully');
                // Reset form data
                */
                // setEstimatedPrice(0);
                setRequestData(prevData => ({
                    ...prevData,
                    started: true
                }));
                console.log("Successfully started");
            } else {
                // Handle error
                console.error(response.status);
            }
        } catch (error) {
            console.error('Error starting request:', error);
        }
    }

    const handleFinishRequest = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(`http://localhost:2810/request/${requestId}/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });

            if (response.ok) {
                /*setSuccessfullyCreated(true);
                setEmptyField(false);
                // Success - handle the successful creation
                console.log('Request created successfully');
                // Reset form data
                */
                // setEstimatedPrice(0);
                setRequestData(prevData => ({
                    ...prevData,
                    solved: true
                }));
                console.log("Successfully finished");
            } else {
                // Handle error
                console.error(response.status);
            }
        } catch (error) {
            console.error('Error finishing request:', error);
        }
    }

    useEffect(() => {
        if (requestData.arrival !== '') {
            fetch(`/parking/byName/${requestData.arrival}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    // Selectively update the state based on fetched data
                    setArrivalParking(data);
                    // console.log("Arrival Parking " + arrivalParking.name);
                })
                .catch((error) => {
                    console.error('Error fetching arrival parking details:', error);
                });
        } else {
            console.log ("Else");
        }
    }, [requestData.arrival]);


    useEffect(() => {
        if (requestData.departure !== '') {
            fetch(`/parking/byName/${requestData.departure}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    // Selectively update the state based on fetched data
                    setDepartureParking(data);
                    // console.log("Departure Parking " + departureParking.name);
                })
                .catch((error) => {
                    console.error('Error fetching departure parking details:', error);
                });
        } else {
            console.log ("Else");
        }
    }, [requestData.departure]);


    const handleViewVehicle = () => {
       window.location.href = `/vehicle/${requestData.vehicleId}`;
    };

    useEffect(() => {
        fetch(`/request/${requestId}`, {
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
                    vehicleId: data.vehicleId,
                    started: data.started,
                    solved: data.solved
                }));
                console.log(requestData);
                console.log(requestData.vehicleId);
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [requestId]);

    useEffect( () => {
        if (arrivalParking != null && departureParking != null) {
            setParkings([arrivalParking, departureParking]);
        }
    }, [arrivalParking, departureParking])


    if (error) {
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
        <div style={{minHeight:'100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center" style={{marginBottom:'7vh'}}>
                <div className="view-form" style={{borderColor: 'black'}}>
                    <h2 className="mb-4 text-center">View Request</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Date:</label>
                        <button>{requestData.date}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Departure:</label>
                        <button>{requestData.departure}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Arrival:</label>
                        <button>{requestData.arrival}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Start Hour:</label>
                        <button>{requestData.startHour}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">End Hour:</label>
                        <button> {requestData.endHour} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Started:</label>
                        <button> {requestData.started ? "Yes" : "No"} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Finished:</label>
                        <button> {requestData.solved ? "Yes" : "No"} </button>
                    </div>
                    <br/>
                    <div className="d-flex justify-content-center">
                            <Button variant="secondary" onClick={handleViewVehicle} style={{borderColor: 'black', borderWidth: '2px'}}>
                                View Vehicle
                            </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flex: 2, position: 'relative'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', overflow: 'hidden' }}>
                        <GoogleMap center={center} zoom={12} mapContainerStyle={{width: '75%', height: '75%', border: '3px solid black', overflow: 'hidden' , marginBottom: '4vh'}}>
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
                    {requestData.started !== '' && !requestData.started &&
                        <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={handleStartRequest}>
                            Start Request
                        </Button>
                    }
                    {requestData.started !== '' && requestData.started && requestData.solved !== '' && !requestData.solved &&
                        <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={handleFinishRequest}>
                            Finish Request
                        </Button>
                    }
                    </div>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default RequestView;