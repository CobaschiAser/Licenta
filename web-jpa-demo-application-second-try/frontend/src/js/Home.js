import React, { useState } from 'react';
import '../css/Home.css';
import AppNavbar from './AppNavbarBeforeLogin';
import { Button, Container, Row, Col } from 'reactstrap';
import Footer from "./AppFooter";
import AppFooter from "./AppFooter";
import AppNavbarAfterLogin from "./AppNavbarAfterLogin";
import {jwtDecode} from "jwt-decode";
import AppNavbarBeforeLogin from "./AppNavbarBeforeLogin";
import MyNavbar from "./MyNavbar";

const testimonials = [
    {
        quote: "Lorem ipsum dolor sit amet",
        author: "John Doe"
    },
    {
        quote: "Duis aute irure dolor in reprehenderit",
        author: "Jane Smith"
    },
    {
        quote: "Sed ut perspiciatis unde omnis",
        author: "Emily Johnson"
    }
];

const Home = () => {

    const redirectToRegister = () => {
        window.location.href = "/register";
    }

    const redirectToAboutUs = () => {
        window.location.href = "/about-us";
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
    };

    // const [jwt, setJwt] = useState( localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    return (
        <div style={{height: "100%" }}>
            {/*{jwt === '' && <AppNavbarBeforeLogin/>}
            {jwt !== '' && <AppNavbarAfterLogin/>}*/}
            <MyNavbar/>
            <Container style={{ marginBottom:"5vh"}}>
                <Row style={{display:"flex", justifyContent: "center", textAlign: "center", marginTop: "5vh"}}>
                    <Col md={6}>
                        <h1>Welcome to SelfDrive</h1>
                        <p className="lead"><i className="bi bi-speedometer2 me-3"></i>Because we care about your time</p>
                        <Button variant="primary" type="button" onClick={redirectToRegister}>Get started</Button>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "1vh"}}>
                        <h2>About Us</h2>
                    </div>
                    <Col md={8} style={{textAlign: "center", marginLeft: "17%"}}>
                        <div className="about-us-box" style={{display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", width: "100%"}}>
                            <p>We are SelfDrive.</p>
                            <p>Forget the stress about owning a car. Just use ours.</p>
                            <p>It is easier and faster.</p>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button  className="mr-2" onClick={redirectToAboutUs} style={{width: "auto"}}>Read more</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "1vh"}}>
                        <h2>Testimonials</h2>
                    </div>
                     {testimonials.map((testimonial, index) => (
                         <Col md={4} key={index} style={{ transform: `translateX(${(index - currentIndex) * 100}%)`, transition: "transform 0.5s ease-in-out" }}>
                             <div className="testimonial-box">
                                 <p>"{testimonial.quote}"</p>
                                 <p className="testimonial-author">- {testimonial.author}</p>
                             </div>
                         </Col>
                     ))}
                </Row>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}>
                    <Button onClick={handlePrev}>&lt;</Button>
                    <Button onClick={handleNext}>&gt;</Button>
                </div>
            </Container>
            <AppFooter/>
        </div>
    );
}

export default Home;
