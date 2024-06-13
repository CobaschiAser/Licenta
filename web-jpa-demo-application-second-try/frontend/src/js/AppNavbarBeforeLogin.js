import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

function AppNavbarBeforeLogin() {
    const toggleHome = () => {
        window.location.href = '/';
    };

    const toggleRegister = () => {
        window.location.href = '/register';
    };

    const toggleAboutUs = () => {
        window.location.href = '/about-us';
    };

    const toggleLogin = () => {
        window.location.href = '/login';
    };

    return (
        <Navbar color="dark" dark expand="md" style={{ display: 'flex', alignItems: 'center' }}>
            <NavbarBrand tag={Link} to="/" onClick={toggleHome}>
                <img src={logo} style={{ marginRight: '10px', height: "50px" }}  alt={logo}/>
            </NavbarBrand>
            <NavbarBrand tag={Link} to="/" onClick={toggleHome}> Home</NavbarBrand>
            <NavbarBrand tag={Link} to="/register" onClick={toggleRegister}> Register</NavbarBrand>
            <NavbarBrand tag={Link} to="/about-us" onClick={toggleAboutUs}> About Us</NavbarBrand>
            <div style={{ marginLeft: 'auto' }}>
                <NavbarBrand tag={Link} to="/login" onClick={toggleLogin}> Sign In</NavbarBrand>
            </div>
        </Navbar>
    );
}

export default AppNavbarBeforeLogin;
