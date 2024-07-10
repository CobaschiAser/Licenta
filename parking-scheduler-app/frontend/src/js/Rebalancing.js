import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "./navbar_footer/MyNavbar";
import {Button, Container} from "reactstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import {Form} from "react-bootstrap";
import ParkingPieChart from "./charts/ParkingPieChart";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import AppFooter from "./navbar_footer/AppFooter";
import {CENTER, GOOGLE_MAP_KEY} from "../constants/constants";
import VehiclePieChart from "./charts/VehiclePieChart";

const RebalancingPage = () => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    const [error, setError] = useState(false);
    const [period, setPeriod] = useState(localStorage.getItem('rebalancing_period') || 'total');
    const [parkings, setParkings] = useState([]);
    const [selectedParking, setSelectedParking] = useState(null);
    const [statisticParking, setStatisticParking] = useState(localStorage.getItem('rebalancing_statistic'));
    const [moves, setMoves] = useState([]);
    const [countMap, setCountMap] = useState([]);
    const [successfullyRebalanced, setSuccessfullyRebalanced] = useState(false);
    const [noEffectRebalanced, setNoEffectRebalanced] = useState(false);
    const [hierarchy, setHierarchy] = useState(null)

    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });



    if (jwt === '') {
        setError(true);
        window.location.href = '/login';
    }

    if (jwt !== '' && jwt['isAdmin'] === '0') {
        setError(true);
        window.location.href = '/error';
    }

    const handleStatisticParking = (event) => {
        const {value} = event.target;
        setStatisticParking(value);
        localStorage.setItem('rebalancing_statistic',value);
    }
    const handlePeriodChange = (event) => {
        const {value} = event.target;
        setPeriod(value);
        setSuccessfullyRebalanced(false);
        setNoEffectRebalanced(false);
        localStorage.setItem('rebalancing_period', value);
    }
    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }

    const handleRebalance = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:2810/rebalancing?period=${period}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const body = await response.json();
                console.log(body);
                setMoves(body);
                if (body.length === 0) {
                    setNoEffectRebalanced(true);
                    setSuccessfullyRebalanced(false);
                } else {
                    setSuccessfullyRebalanced(true);
                    setNoEffectRebalanced(false);
                }

            } else {
                setSuccessfullyRebalanced(false);
                setNoEffectRebalanced(true);
            }
        } catch (error) {
            console.error('Error rebalancing:', error);
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/parking`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                //console.log('Response:', body);
                setParkings(body);
            } catch (error) {
                console.error('Error fetching parkings data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/parking/hierarchy?period=${period}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                //console.log('Response:', body);
                setHierarchy(body);
            } catch (error) {
                console.error('Error fetching parkings data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2810/rebalancing?parkingId=${statisticParking}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                setCountMap(body);
                console.log(body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[statisticParking]);



    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>Error..</div>
        );
    }

    return (
        <div style={{minHeight:"100vh", display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5" style={{height:"100%", marginBottom: '7vh'}}>
                <div className="text-center">
                    <h2 className="mb-4 text-center">Parking Rebalancing</h2>
                </div>
                <div style={{ display: 'flex', minHeight:"80vh"}}>
                    <div className="statistics-and-chart-zone">
                        <div className="statistics" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection: 'column',  justifyContent: "space-between"}}>
                            <div className="select-period" style={{display: 'flex', flexDirection: 'column', marginBottom: '5vh'}}>
                                <b>Select a period</b>
                                <select value={period} onChange={handlePeriodChange}>
                                    <option value="total">Everytime</option>
                                    <option value="1d">Today</option>
                                    <option value="7d">Last Week</option>
                                    <option value="1m">Last Month</option>
                                    <option value="6m">Last Six Months</option>
                                    <option value="1y">Last Year</option>
                                </select>
                            </div>
                            <div>
                                <Button variant="secondary" type="button" onClick={handleRebalance} style={{borderColor: 'black', borderWidth: '2px'}}>
                                    Rebalance
                                </Button>
                            </div>
                        </div>

                        {successfullyRebalanced && !noEffectRebalanced &&
                            <div className="chart-zone" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection:"initial",  justifyContent: "space-around"}}>
                                <div style={{maxHeight: '20%', display: 'flex', flexDirection: 'column'}}>
                                    <b>Parking Hierarchy</b>
                                </div>
                                <VehiclePieChart myMap={hierarchy}/>
                            </div>

                        }

                        {successfullyRebalanced && !noEffectRebalanced &&
                        <div className="chart-zone" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection:"initial",  justifyContent: "space-around"}}>
                            <div style={{maxHeight: '20%', display: 'flex', flexDirection: 'column'}}>
                                <b>Select a Parking</b>
                                <select
                                    value={statisticParking}
                                    onChange={handleStatisticParking}
                                >
                                    <option key={0} value={0}> DEPOU</option>
                                    {parkings.map((parking) => (
                                        <option key={parking.id} value={parking.id}>
                                            {parking.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {statisticParking !== null && <VehiclePieChart myMap={countMap}/>}
                        </div>
                        }
                        {
                            !successfullyRebalanced && noEffectRebalanced &&
                            <div className="chart-zone" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection:"initial",  justifyContent: "space-around", maxWidth: '100%'}}>
                                No effects.<br/>
                                No movable vehicles <br/>
                                Or not sustainable
                            </div>
                        }
                    </div>
                    <div style={{ flex: 2, position: 'relative', border: '3px solid black', marginLeft: "10vh"}}>
                        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden' }}>
                            <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden' }}>
                                {parkings.map(parking => (
                                    <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)}/>
                                ))}
                                {selectedParking && (
                                    <InfoWindow
                                        position={{ lat: selectedParking.x, lng: selectedParking.y }}
                                        onCloseClick={() => setSelectedParking(null)}
                                    >
                                        <div style={{alignContent: 'center', textAlign: 'center'}}>
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
                        </div>
                    </div>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );

}

export default RebalancingPage;