import React, {useEffect, useState} from "react";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import AppNavbar from "../AppNavbarBeforeLogin";
import {Container} from "reactstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import {Form} from "react-bootstrap";
import ParkingPieChart from "../charts/ParkingPieChart";
import AppFooter from "../AppFooter";
import VehiclePieChart from "../charts/VehiclePieChart";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const VehicleStatistics = () => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])

    const [vehiclesDistribution, setVehiclesDistribution] = useState([]);

    const [criteria, setCriteria] = useState(localStorage.getItem('vehicle_gs_criteria') || 'fabricationYear');

    const handleCriteriaChange = (event) => {
        const {value} = event.target;
        setCriteria(value);
        localStorage.setItem('vehicle_gs_criteria',value);
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2810/vehicle/statistics?criteria=${criteria}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                setVehiclesDistribution(body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[criteria]);

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{minHeight:"100vh", display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5" style={{height:"100%"}}>
                <div className="text-center">
                    <h2 className="mb-4 text-center">Vehicle Statistics</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column',  minHeight:"80vh"}}>
                    <div className="statistics-and-chart-zone">
                        <div className="statistics" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", justifyContent: "space-evenly"}}>
                            <div> Select a criteria </div>
                            <div className="select-criteria">
                                <select
                                    value={criteria}
                                    onChange={handleCriteriaChange}
                                >
                                    <option value="fabricationYear"> Fabrication Year</option>
                                    <option value="currentParking"> Current Parking </option>
                                    <option value="type"> Vehicle Type</option>

                                </select>
                            </div>
                        </div>
                        <div className="chart-zone" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", flexDirection:"initial",  justifyContent: "space-around"}}>
                            <VehiclePieChart myMap = {vehiclesDistribution}/>
                        </div>
                    </div>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
}

export default VehicleStatistics;
