import React from 'react'
import './Css/NavBar1.css';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const navigate=useNavigate();


    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate("/login");
    };

    
const gotoHome=()=>{
    navigate("/SideBar")
}
    return (
        <div class="navbar1">
            <img src='https://www.winwire.com/wp-content/themes/winwirewp-theme/assets/images/logos/logo.png'/>
            <div>
                <button class="navbar3" onClick={gotoHome}>Home</button>
                <button class="navbar4" onClick={handleLogout}>Logout</button>
            </div>
        </div>

    )
}

export default NavBar