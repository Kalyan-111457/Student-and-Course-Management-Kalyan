import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import './css/NavBar1.css';

const Navbar = () => {
    const navigate = useNavigate();

    const [student, setStudent] = useState([]);


    const email = localStorage.getItem("email");

    const token = localStorage.getItem("token");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate("/login");
    };


    useEffect(() => {
        const fetchStudent = async () => {


            const response = await fetch(
                `http://localhost:5049/api/Admin/ByEmail/${encodeURIComponent(email)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,   // <-- ADD THIS
                    },
                }
            );
            const data = await response.json();

            const studentsArray = Array.isArray(data) ? data : [data];

            setStudent(studentsArray);

            if (studentsArray.length > 0) {
                localStorage.setItem("studentId", studentsArray[0].studentId);
                localStorage.setItem("StudentName", studentsArray[0].fullName);
            }
        };
        fetchStudent();
    }, [email]);





    return (

        <>

            <nav className="kl1">
                <img src="https://www.winwire.com/wp-content/themes/winwirewp-theme/assets/images/logos/logo.png"/>
                <ul className="kl-menu">
                    <li><Link to="/student/enrolled">My Enrollments</Link></li>
                    <li><Link to="/StudentDetails">My Details</Link></li>
                    <li>
                        <button onClick={handleLogout} className="kl4">Logout</button>
                    </li>
                </ul>

                <div className="kl2">
                    {student.map((item) => (
                        <div className="kl3" key={item.studentId}>
                            <p>Hi, <strong>{item.fullName}</strong></p>
                        </div>
                    ))}
                </div>
            </nav>




        </>
    );
};

export default Navbar;
