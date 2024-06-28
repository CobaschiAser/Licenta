import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import {Button, Container, Form} from "react-bootstrap";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import AppFooter from "../navbar_footer/AppFooter";
import MyNavbar from "../navbar_footer/MyNavbar";
import {jwtDecode} from "jwt-decode";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";
const DepotView = () => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])

    const [depotData, setDepotData] = useState({
        name: '',
        x: '',
        y: '',
        maxCapacity: '',
        currentCapacity: '',
        vehicles: ''
    });
    const [selectedDepot, setSelectedDepot] = useState(null);
    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });


    const handleViewDepotVehicles = () => {
        window.location.href = `/depot/vehicles`;
    }

    useEffect(() => {
        fetch(`/depot`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setDepotData((prevData) => ({
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
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>Error..</div>
        )
    }


    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            <div style={{ display: 'flex', marginBottom: '7vh'}}>
                <div style={{ flex: 2, padding: '10px'}}>
                    <Container className="mt-5 d-flex justify-content-center border-1">
                        <div className="view-form" style={{borderColor: 'black'}}>
                            <h2 className="mb-4 text-center">View {depotData.name}</h2>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Name:</label>
                                <button>{depotData.name}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate X:</label>
                                <button>{depotData.x}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate Y:</label>
                                <button>{depotData.y}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Maximum Capacity:</label>
                                <button>{depotData.maxCapacity}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Current Capacity:</label>
                                <button> {depotData.currentCapacity} </button>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-center">
                                {depotData.vehicles.length > 0 &&
                                    <Button variant="secondary" type="button" className="text-center" onClick={handleViewDepotVehicles} style={{borderColor: 'black', borderWidth: '2px'}}>
                                        View Vehicles
                                    </Button>
                                }
                            </div>
                        </div>
                    </Container>
                </div>
                <div style={{ flex: 3, position: 'relative'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden'}}>
                        <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden'}}>
                            <Marker key={depotData.id} position={{ lat: depotData.x, lng: depotData.y }} onClick={() => setSelectedDepot(depotData)} />

                            {selectedDepot && (
                                <InfoWindow
                                    position={{ lat: selectedDepot.x, lng: selectedDepot.y }}
                                    onCloseClick={() => setSelectedDepot(null)}
                                >
                                    <div>
                                        <p>{selectedDepot.name}</p>
                                        <p>Current capacity: {selectedDepot.currentCapacity}</p>
                                        <p>Max capacity: {selectedDepot.maxCapacity}</p>
                                        {selectedDepot.vehicles.length !== 0 && <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={() => handleViewDepotVehicles()}>
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

export default DepotView;