import React, {useState} from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import {jwtDecode} from "jwt-decode";

function AppNavbarAfterLogin() {


    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    const toggleHome = () => {
        window.location.href = '/';
    };

    const toggleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const toggleAboutUs = () => {
        window.location.href = '/about-us';
    };

    const toggleUserDashboard = () => {
        window.location.href = '/dashboard';
    }

    const toggleAdminDashboard = () => {
        window.location.href = '/admin-dashboard';
    }


    return (
        <Navbar color="dark" dark expand="md" style={{ display: 'flex', alignItems: 'center' }}>
            <NavbarBrand tag={Link} to="/" onClick={toggleHome}>
                   <img src={logo} style={{ marginRight: '10px', height: "50px" }}  alt={logo}/>
            </NavbarBrand>
            <NavbarBrand tag={Link} to="/" onClick={toggleHome}> Home</NavbarBrand>
            <NavbarBrand tag={Link} to="/about-us" onClick={toggleAboutUs}> About Us</NavbarBrand>
            {jwt['isAdmin'] === '0' && <NavbarBrand tag={Link} to="/dashboard" onClick={toggleUserDashboard}>Dashboard</NavbarBrand>}
            {jwt['isAdmin'] === '1' && <NavbarBrand tag={Link} to="/admin-dashboard" onClick={toggleAdminDashboard}>Dashboard</NavbarBrand>}

            <div style={{ marginLeft: 'auto' }}>
                <NavbarBrand tag={Link} to="/home" onClick={toggleLogout}> Sign Out</NavbarBrand>
            </div>
        </Navbar>
    );
}

export default AppNavbarAfterLogin;
