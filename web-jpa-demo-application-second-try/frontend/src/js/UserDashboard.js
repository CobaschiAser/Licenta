import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import AppFooter from "./AppFooter";
import AppNavbarAfterLogin from "./AppNavbarAfterLogin";
import {jwtDecode} from "jwt-decode";
import UserSidebar from "./UserSidebar";
import {Button} from "reactstrap";

const UserDashboard = () => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    if (jwt === '') {
        window.location.href = '/login';
    }

    if (jwt !== '' && jwt['isAdmin'] === '1') {
        window.location.href = '/error';
    }
    console.log(jwt);

    const [parkings, setParkings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const center = { lat: 47.164775, lng: 27.580579 };
    const [selectedParking, setSelectedParking] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCb-4jTxY5NLnRNdLs0UTylKMvUfXh5clU",
    });

    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }


    useEffect(() => {
        // Fetch parking data from API
        fetch(`/parking`, {
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
         fetch(`http://localhost:2810/vehicle`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setVehicles(data);
            })
            .catch(error => console.error('Error fetching vehicle data:', error));
    }, []);


    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AppNavbarAfterLogin />
            <div style={{ display: 'flex', minHeight: '80vh' }}>
                <div style={{ flex: 1, border: '1px solid black', padding: '10px', backgroundColor: 'gray'}}>
                    <UserSidebar username={jwt['username']} userId={jwt['uuid']}/>
                </div>
                <div style={{ flex: 4, position: 'relative', border: '1px solid black', backgroundColor: 'darkgray'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'gray' }}>

                        <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '75%', border: '2px solid black', borderRadius: '10px', overflow: 'hidden'}}>
                            {parkings.map(parking => (
                                <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)}/>
                            ))}
                            {selectedParking && (
                                <InfoWindow
                                    position={{ lat: selectedParking.x, lng: selectedParking.y }}
                                    onCloseClick={() => setSelectedParking(null)}
                                >
                                    <div>
                                        <p> <strong>{selectedParking.name} </strong> </p>
                                        <p> <strong> Current capacity: </strong> {selectedParking.currentCapacity}</p>
                                        <p> <strong> Max capacity: </strong> {selectedParking.maxCapacity}</p>
                                        {selectedParking.vehicles.length !== 0 && <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={() => handleViewParkingVehicles(selectedParking.id)}>
                                            View Vehicles
                                        </Button>}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                        <div style={{ width : '100%', height: '25%', display: 'flex', flexDirection: 'column', border: '1px solid black', backgroundColor: 'lightgray' }}>
                            <h4 style={{ textAlign: 'center', height: '40%' }}>General Overview</h4>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <p> <strong>Parking number: </strong> {parkings.length}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <p> <strong>Vehicle number: </strong> {vehicles.length}</p>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
            <AppFooter/>
        </div>
    );
};

export default UserDashboard;
