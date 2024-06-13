import '../../css/ItemList.css';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import ParkingPieChart from "../charts/ParkingPieChart";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import {Form} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";

const ParkingStatistics = () => {

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


    const [parkings, setParkings] = useState([]);

    const [period, setPeriod] = useState(localStorage.getItem('parking_gs_period') || 'total');

    const [statisticParking, setStatisticParking] = useState(localStorage.getItem('parking_gs_statistic'));

    const [selectedParking, setSelectedParking] = useState(null);

    const [allParkings , setAllParkings] = useState(false);

    const [mapParkings, setMapParking] = useState([]);

    const [requestNr, setRequestNr] = useState(0);

    const [inputNr, setInputNr] = useState(0);

    const [outputNr, setOutputNr] = useState(0);

    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });

    const handleStatisticParking = (event) => {
        const {value} = event.target;
        setStatisticParking(value);
        localStorage.setItem('parking_gs_statistic',value);
    }
    const handlePeriodChange = (event) => {
        const {value} = event.target;
        setPeriod(value);
        localStorage.setItem('parking_gs_period', value);
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
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const all = allParkings ? 1:0;
                const response = await fetch(`http://localhost:2810/parking/statistics?all=${all}&id=${statisticParking}&period=${period}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                //console.log('Response:', body);
                setRequestNr(body[0]);
                setInputNr(body[1]);
                setOutputNr(body[2]);
                console.log("Request nr: ",requestNr);
                console.log("Input nr: ", inputNr);
                console.log("Output nr: ",outputNr);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [allParkings, statisticParking, period]);


    useEffect(() => {
        const selectedParkingIndex = parkings.findIndex(parking => parking.id === parseInt(statisticParking)); // Find index of selected parking
        setMapParking(selectedParkingIndex !== -1 ? [parkings[selectedParkingIndex]] : []); // Set mapParkings based on selectionlocalStorage.setItem('parking_gs_statistic', value);

    }, [statisticParking, parkings])

    console.log(statisticParking);
    console.log(parkings);
    console.log(mapParkings);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error...</div>
    }

    // Calculate data for pie chart based on clients data
    // Sort clients based on selected sorting option
    return (
        <div style={{minHeight:"100vh", display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5" style={{height:"100%", marginBottom: '7vh'}}>
                <div className="text-center">
                    <h2 className="mb-4 text-center">Parking Statistics</h2>
                </div>
                <div style={{ display: 'flex', minHeight:"80vh"}}>
                    <div className="statistics-and-chart-zone">
                        <FormCheckLabel>
                            <Form.Check
                                type="checkbox"
                                label="All Parkings"
                                checked={allParkings}
                                onChange={(e) => setAllParkings(e.target.checked)}
                            />
                        </FormCheckLabel>
                        <div className="statistics" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", justifyContent: "space-around"}}>
                            {!allParkings && <div className="select-parking">
                                <select
                                    value={statisticParking}
                                    onChange={handleStatisticParking}
                                >
                                    {parkings.map((parking) => (
                                        <option key={parking.id} value={parking.id}>
                                            {parking.name}
                                        </option>
                                    ))}
                                </select>
                            </div>}
                            <div className="select-period">
                                <select value={period} onChange={handlePeriodChange}>
                                    <option value="total">Everytime</option>
                                    <option value="1d">Today</option>
                                    <option value="7d">Last Week</option>
                                    <option value="1m">Last Month</option>
                                    <option value="6m">Last Six Months</option>
                                    <option value="1y">Last Year</option>
                                </select>
                            </div>
                        </div>
                        <div className="chart-zone" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection:"initial",  justifyContent: "space-around"}}>
                            <ParkingPieChart requestNr={requestNr} inputNr={inputNr} outputNr={outputNr}/>
                        </div>
                    </div>
                    <div style={{ flex: 2, position: 'relative', border: '3px solid black', marginLeft: "10vh"}}>
                        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden' }}>
                            <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden' }}>
                                {/*allParkings  ? {parkings.map(parking => (
                                    <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                                ))}
                                : {mapParkings.map(parking => (
                                            <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                                        ))}*/}
                                {allParkings && parkings.map(parking => (
                                    <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                                ))}
                                {!allParkings && mapParkings.length > 0 && mapParkings.map(parking => (
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

export default ParkingStatistics;
