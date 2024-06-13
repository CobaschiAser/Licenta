import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import {Button, Container, Form} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {GoogleMap, InfoWindow, Marker, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import AppFooter from "../AppFooter";
import MyNavbar from "../MyNavbar";
import {jwtDecode} from "jwt-decode";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
const ParkingView = ({ parkingId }) => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])

    const [parkings, setParkings] = useState([]);
    const [vehicleCanBeAdded, setVehicleCanBeAdded] = useState([]);
    const [vehicleCanBeRemoved, setVehicleCanBeRemoved] = useState([]);
    const [vehicleAfterRequest, setVehicleAfterRequest] = useState([]);
    const [parkingData, setParkingData] = useState({
        name: '',
        x: '',
        y: '',
        maxCapacity: '',
        currentCapacity: '',
        vehicles: ''
    });
    const [selectedParking, setSelectedParking] = useState(null);
    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });


    useEffect(() => {
        // Fetch parking data from API
        fetch(`/parking`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setParkings(data);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, []);

    useEffect(() => {
        // Fetch parking data from API
        fetch(`/vehicle/can-be-added`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setVehicleCanBeAdded(data);
                console.log(vehicleCanBeAdded);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, []);

    useEffect(() => {
        // Fetch parking data from API
        fetch(`/vehicle/can-be-removed?parkingId=${parkingId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setVehicleCanBeRemoved(data);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, []);

    useEffect(() => {
        // Fetch parking data from API
        fetch(`/vehicle/all-after-request?parkingId=${parkingId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setVehicleAfterRequest(data);
                console.log(vehicleAfterRequest);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, [parkingId]);

    const handleViewParkingVehicles = () => {
        window.location.href = `/parking/${parkingId}/vehicles`;
    }
    const handleViewVehicles = (e) => {
        window.location.href = `/parking/${parkingId}/vehicles`;
    };

    const handleAddVehicle = (e) => {
        window.location.href = `/parking/${parkingId}/add-vehicles`;
    };

    const handleRemoveVehicle = (e) => {
        window.location.href = `/parking/${parkingId}/remove-vehicles`;
    };

    useEffect(() => {
        fetch(`/parking/byId/${parkingId}`,{
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
                    maxCapacity: data.maxCapacity,
                    currentCapacity: data.currentCapacity,
                    vehicles:data.vehicles
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [parkingId]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    console.log("vehicleCanBeAdded:", vehicleCanBeAdded);
    console.log("vehicleAfterRequest:", vehicleAfterRequest);
    console.log("parkingData.maxCapacity:", parkingData.maxCapacity);

    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            <div style={{ display: 'flex', marginBottom: '7vh'}}>
                <div style={{ flex: 2, padding: '10px'}}>
                    <Container className="mt-5 d-flex justify-content-center border-1">
                        <div className="view-form" style={{borderColor: 'black'}}>
                            <h2 className="mb-4 text-center">View Parking: {parkingData.name}</h2>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Name:</label>
                                <button>{parkingData.name}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate X:</label>
                                <button>{parkingData.x}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate Y:</label>
                                <button>{parkingData.y}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Maximum Capacity:</label>
                                <button>{parkingData.maxCapacity}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Current Capacity:</label>
                                <button> {parkingData.currentCapacity} </button>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-center">
                                {parkingData.vehicles.length > 0 &&
                                    <Button variant="secondary" type="button" className="text-center" onClick={handleViewVehicles} style={{borderColor: 'black', borderWidth: '2px'}}>
                                        View Vehicles
                                    </Button>
                                }
                                    {   vehicleCanBeAdded && vehicleCanBeAdded.length > 0  && vehicleAfterRequest.length < parkingData.maxCapacity &&
                                        <Button variant="secondary" type="button" className="text-center" onClick={handleAddVehicle} style={{borderColor: 'black', borderWidth: '2px'}}>
                                            Add Vehicle
                                        </Button>
                                    }
                                    {   vehicleCanBeRemoved && vehicleCanBeRemoved.length > 0 &&
                                        <Button variant="secondary" type="button" className="text-center" onClick={handleRemoveVehicle} style={{borderColor: 'black', borderWidth: '2px'}}>
                                            Remove Vehicle
                                        </Button>
                                    }
                                </div>
                        </div>
                    </Container>
                </div>
                <div style={{ flex: 3, position: 'relative'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden'}}>
                    <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden'}}>
                    <Marker key={parkingData.id} position={{ lat: parkingData.x, lng: parkingData.y }} onClick={() => setSelectedParking(parkingData)} />

                        {selectedParking && (
                    <InfoWindow
                        position={{ lat: selectedParking.x, lng: selectedParking.y }}
                        onCloseClick={() => setSelectedParking(null)}
                    >
                        <div>
                            <p>{selectedParking.name}</p>
                            <p>Current capacity: {selectedParking.currentCapacity}</p>
                            <p>Max capacity: {selectedParking.maxCapacity}</p>
                            {selectedParking.vehicles.length !== 0 && <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={() => handleViewParkingVehicles()}>
                                View Vehicles
                            </Button>}
                        </div>
                    </InfoWindow>
                )}

            </GoogleMap>
                    </div>
                </div>
        </div>
            <AppFooter/>
        </div>
    );
};

export default ParkingView;