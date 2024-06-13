import '../../css/ItemList.css';
import React, {useEffect, useRef, useState} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartComponent from "../charts/UserGeneralPieChart";
import UserGeneralChartComponent from "../charts/UserGeneralPieChart";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const UserGeneralStatistic = () => {

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


    const [totalUser, setTotalUser] = useState([]);

    const [period, setPeriod] = useState(localStorage.getItem('user_gs_period') || 'total');

    const [periodUser, setPeriodUser] = useState([]);

    const [activeUserPeriod, setActiveUserPeriod] = useState([]);
    const handlePeriodChange = (event) => {
        const {value} = event.target;
        setPeriod(value);
        localStorage.setItem('user_gs_period', value);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2810/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                //console.log('Response:', body);
                setTotalUser(body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2810/user/statistics?period=${period}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                console.log('Response:', body);
                console.log('Period:', period);
                setPeriodUser(body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [period]);

    useEffect(() =>{
        const activeUsers = periodUser.length > 0 ? periodUser.filter((user) => { return user.requests.length > 0}) : [];
        setActiveUserPeriod(activeUsers);
        console.log(activeUsers);
    }, [periodUser])


    if (error) {
        return(
            <div>Error..</div>
        )
    }

    // Calculate data for pie chart based on clients data
    // Sort clients based on selected sorting option
    return (
        <div style={{minHeight:"100vh", display: 'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5" style={{height:"100%"}}>
                <div className="text-center">
                    <h2 className="mb-4 text-center">User Statistics</h2>
                </div>
                <div className="sorting-and-searching-section" style={{marginTop: '5vh', marginBottom: '5vh', display: "flex", justifyContent: "space-around"}}>
                    <div className="sorting-section">
                        <select value={period} onChange={handlePeriodChange}>
                            <option value={"total"}>Everytime</option>
                            <option value={"1d"}>Today</option>
                            <option value={"7d"}>Last Week</option>
                            <option value={"1m"}>Last Month</option>
                            <option value={"6m"}>Last Six Months</option>
                            <option value={"1y"}>Last Year</option>
                        </select>
                    </div>
                    <UserGeneralChartComponent totalUser={totalUser.length} periodUser={periodUser.length} type={"period"}/>
                    <UserGeneralChartComponent totalUser={periodUser.length} periodUser={activeUserPeriod.length} type={"active"}/>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
}

export default UserGeneralStatistic;
