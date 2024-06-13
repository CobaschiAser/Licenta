import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import {Link, useHistory} from "react-router-dom";
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container} from "react-bootstrap";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
import {DirectionsRenderer, GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import MyNavbar from "../MyNavbar";

const RideView = ({ rideId, userId }) => {

    const [error, setError] = useState(false);

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    if (jwt === '') {
        window.location.href = '/login';
    }

    if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
        setError(true);
        window.location.href = '/error';
    }

    const [rideData, setRideData] = useState({
        distance: '',
        price: '',
        date: '',
        startHour: '',
        endHour: '',
        departure: '',
        arrival: '',
        vehicleId: ''
    });

    const [arrivalParking, setArrivalParking] = useState(null);
    const [departureParking, setDepartureParking] = useState(null);

    const [selectedParking, setSelectedParking] = useState(null);

    const [directions, setDirections] = useState(null);

    const [parkings, setParkings] = useState([]);

    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });

    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }


    const handleViewVehicle = () => {
        window.location.href = `/vehicle/${rideData.vehicleId}`;
    };

    useEffect(() => {
        if (rideData.arrival !== '') {
            fetch(`/parking/byName/${rideData.arrival}`, {
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
    }, [rideData.arrival]);


    useEffect(() => {
        if (rideData.departure !== '') {
            fetch(`/parking/byName/${rideData.departure}`, {
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
    }, [rideData.departure]);

    useEffect(() => {
        fetch(`/ride/${rideId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setRideData((prevData) => ({
                    ...prevData, // Keep the existing state
                    distance: data.distance,
                    price: data.price,
                    date: data.date,
                    startHour: data.startHour,
                    endHour: data.endHour,
                    departure: data.departure,
                    arrival: data.arrival,
                    vehicleId: data.vehicleId
                }));
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });

    }, [rideId]);

    /*useEffect( () => {
        if (arrivalParking != null && departureParking != null) {
            setParkings([arrivalParking, departureParking]);
        }
    }, [arrivalParking, departureParking])*/


    useEffect(() => {
        if (departureParking !== null && arrivalParking !== null) {
            calculateRoute();
        }
    }, [departureParking, arrivalParking]);
   const calculateRoute = async () => {
        if (departureParking !== null && arrivalParking !== null) {
            console.log("I AM HERE");
            const directionsService = new window.google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: {lat: departureParking.x, lng: departureParking.y},
                destination: {lat: arrivalParking.x, lng: arrivalParking.y},
                travelMode: window.google.maps.TravelMode.DRIVING,
            });
            setDirections(result);
            console.log(result);
        }
    }


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
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5 d-flex justify-content-center" style={{marginBottom:'7vh'}}>
                <div className="view-form" style={{borderColor: 'black'}}>
                    <h2 className="mb-4 text-center">View Ride</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Date:</label>
                        <button>{rideData.date}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Departure:</label>
                        <button>{rideData.departure}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Arrival:</label>
                        <button>{rideData.arrival}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Start Hour:</label>
                        <button>{rideData.startHour}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">End Hour:</label>
                        <button> {rideData.endHour} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Distance:</label>
                        <button> {rideData.distance} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Price:</label>
                        <button> {rideData.price} </button>
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
                           {/* {parkings.map(parking => (
                                <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                            ))}*/}
                            {departureParking && <Marker key={departureParking.id} position={{lat: departureParking.x, lng: departureParking.y}} onClick={() => setSelectedParking(departureParking)}/>}
                            {arrivalParking && <Marker key={arrivalParking.id} position={{lat: arrivalParking.x, lng: arrivalParking.y}} onClick={() => setSelectedParking(arrivalParking)}/>}


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
                            {directions && (
                                <DirectionsRenderer directions={directions} />
                            )}
                        </GoogleMap>
                    </div>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
};

export default RideView;