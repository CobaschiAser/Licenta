import React, {useState} from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
const AdminSidebar = ({username}) => {
    const [vehicleSubMenuVisible, setVehicleSubMenuVisible] = useState(false);
    const [profileSubMenuVisible, setProfileSubMenuVisible] = useState(false);
    const [userSubMenuVisible, setUserSubMenuVisible] = useState(false);
    const [parkingSubMenuVisible, setParkingSubMenuVisible] = useState(false);
    const [depotSubMenuVisible, setDepotSubMenuVisible] = useState(false);
    const toggleVehicleSubMenu = (event) => {
        event.preventDefault();
        setVehicleSubMenuVisible(!vehicleSubMenuVisible);
    };

    const toggleProfileSubMenu = (event) => {
        event.preventDefault();
        setProfileSubMenuVisible(!profileSubMenuVisible);
    }

    const toggleUserSubMenu = (event) =>{
        event.preventDefault();
        setUserSubMenuVisible(!userSubMenuVisible);
    }

    const toggleParkingSubMenu = (event) => {
        event.preventDefault();
        setParkingSubMenuVisible(!parkingSubMenuVisible);
    }

    const toggleDepotSubMenu = (event) => {
        event.preventDefault();
        setDepotSubMenuVisible(!depotSubMenuVisible);
    }

    const toggleRebalancing = (event) => {
        event.preventDefault();
        window.location.href = '/rebalancing'
    }

    return (
        <div className="d-flex justify-content-between flex-column bg-light text-white p-3" style={{border: "1px solid black"}}>
            <div style={{color : "darkslategray", textAlign: "center"}}>
                <i className="bi bi-code-slash fs-4 me-4"></i>
                <h5>-SelfDrive-</h5> <br/>
                <span>Admin Dashboard</span> <br/>
                <span>Hello, {username}</span>
            </div>
            <hr className="text-secondary"/>
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <a href="/admin-dashboard" style={{color: 'darkslategray'}}>
                        <i className="bi bi-speedometer2 me-3"></i>
                        <span><strong>Dashboard</strong></span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={toggleProfileSubMenu} style={{color: 'darkslategray'}}>
                        <i className="bi bi-person-rolodex me-3"></i>
                        <span><strong>Profile</strong></span>
                        {profileSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {profileSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="#" style={{color: 'darkslategray'}}>
                                    <span>View Profile</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" style={{color: 'darkslategray'}}>
                                    <span>Edit Profile</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="nav-item">
                    <a href="#" onClick={toggleUserSubMenu} style={{color: 'darkslategray'}}>
                        <i className="bi bi-people me-3"></i>
                        <span><strong>User</strong></span>
                        {userSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {userSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/user" style={{color: 'darkslategray'}}>
                                    <span>Inspect Users</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/user/general-statistics" style={{color: 'darkslategray'}}>
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleVehicleSubMenu} style={{color: 'darkslategray'}}>
                        <i className="bi bi-car-front me-3"></i>
                        <span><strong>Vehicle</strong></span>
                        {vehicleSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {vehicleSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/vehicle?page=1" style={{color: 'darkslategray'}}>
                                    <span>Inspect Vehicles</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/vehicle/create" style={{color: 'darkslategray'}}>
                                    <span>Create Vehicle</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/vehicle/statistics/general" style={{color: 'darkslategray'}}>
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleParkingSubMenu} style={{color: 'darkslategray'}}>
                        <i className="bi bi-p-circle me-3"></i>
                        <span><strong>Parking</strong></span>
                        {parkingSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {parkingSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/parking?page=1" style={{color: 'darkslategray'}}>
                                    <span>Inspect Parkings</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/parking/create" style={{color: 'darkslategray'}}>
                                    <span>Create Parking</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/parking/statistics/general" style={{color: 'darkslategray'}}>
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleDepotSubMenu} style={{color: 'darkslategray'}}>
                        <i className="bi bi-x-diamond me-3"></i>
                        <span><strong>Depot</strong></span>
                        {depotSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {depotSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/depot/view" style={{color: 'darkslategray'}}>
                                    <span>Depot Info</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/depot/vehicles" style={{color: 'darkslategray'}}>
                                    <span>Depot Vehicles</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleRebalancing} style={{color: 'darkslategray'}}>
                        <i className="bi bi-aspect-ratio-fill me-3"></i>
                        <span><strong>Rebalancing</strong></span>
                    </a>
                </li>

            </ul>
        </div>
    )
}

export default AdminSidebar;