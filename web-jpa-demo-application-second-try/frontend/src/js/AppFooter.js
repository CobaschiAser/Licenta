import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark">
            <div className="container">
                <span className="text-muted">© 2024 -SelfDrive- All rights reserved.</span>
            </div>
        </footer>
        //style={{ position: "fixed", left: 0, bottom: 0, width: "100%", backgroundColor: "gray", textAlign: "center", padding: "10px 0", color: "white"}}
    );
};

export default Footer;