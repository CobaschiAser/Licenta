import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import AppNavbarAfterLogin from "./AppNavbarAfterLogin";
import AppNavbarBeforeLogin from "./AppNavbarBeforeLogin";

function MyNavbar() {
    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    return (
        <div>
            {jwt !== '' && <AppNavbarAfterLogin/>}
            {jwt === '' && <AppNavbarBeforeLogin/>}
        </div>
    )
}

export default MyNavbar;

