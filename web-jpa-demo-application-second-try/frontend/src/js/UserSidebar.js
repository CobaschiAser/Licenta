import React, {useState} from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
const UserSidebar = ({username, userId}) => {
    const [vehicleSubMenuVisible, setVehicleSubMenuVisible] = useState(false);
    const [profileSubMenuVisible, setProfileSubMenuVisible] = useState(false);
    const [parkingSubMenuVisible, setParkingSubMenuVisible] = useState(false);
    const toggleVehicleSubMenu = (event) => {
        event.preventDefault();
        setVehicleSubMenuVisible(!vehicleSubMenuVisible);
    };

    const toggleProfileSubMenu = (event) => {
        event.preventDefault();
        setProfileSubMenuVisible(!profileSubMenuVisible);
    }
    const toggleParkingSubMenu = (event) => {
        event.preventDefault();
        setParkingSubMenuVisible(!parkingSubMenuVisible);
    }

    const toggleCreateRequest = (event) => {
        event.preventDefault();
        window.location.href = `/user/${userId}/create-request`
    }

    const toggleRequestList = (event) => {
        event.preventDefault();
        window.location.href = `/user/${userId}/request`;
    }

    const toggleRideList = (event) => {
        event.preventDefault();
        window.location.href = `/user/${userId}/ride`;
    }

    const toggleViewProfile = (event) => {
        event.preventDefault();
        window.location.href = `/user/${userId}/view`;
    }

    const toggleEditProfile = (event) => {
        event.preventDefault();
        window.location.href = `/user/${userId}/edit`;
    }

    return (
        <div className="d-flex justify-content-between flex-column bg-light text-white p-3" style={{border: "1px solid black"}}>
            <div style={{color : "darkslategray", textAlign: "center"}}>
                <i className="bi bi-code-slash fs-4 me-4"></i>
                <h5>-SelfDrive-</h5> <br/>
                <span>User Dashboard</span> <br/>
                <span>Hello, {username}</span>
            </div>
            <hr className="text-secondary"/>
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <a href="/dashboard" style={{color: 'darkslategray'}}>
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
                                <a href="#" style={{color: 'darkslategray'}} onClick={toggleViewProfile}>
                                    <span>View Profile</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" style={{color: 'darkslategray'}} onClick={toggleEditProfile}>
                                    <span>Edit Profile</span>
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
                                <a href="/parking/statistics/general" style={{color: 'darkslategray'}}>
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href = "#" onClick={toggleCreateRequest} style={{color: 'darkslategray'}}>
                        <i className="bi bi-suitcase-lg me-3"></i>
                        <span><strong>Create Request</strong></span>
                    </a>
                </li>

                <li className="nav-item">
                    <a href = "#" onClick={toggleRequestList} style={{color: 'darkslategray'}}>
                        <i className="bi bi-card-list me-3"></i>
                        <span><strong>My Requests</strong></span>
                    </a>
                </li>

                <li className="nav-item">
                    <a href = "#" onClick={toggleRideList} style={{color: 'darkslategray'}}>
                        <i className="bi bi-list-check me-3"></i>
                        <span><strong>My Rides</strong></span>
                    </a>
                </li>

            </ul>
        </div>
    )
}

export default UserSidebar;