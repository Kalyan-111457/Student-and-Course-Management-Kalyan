import React, { useEffect, useState } from 'react'

import './css/StudentDeatails1.css';
import Navbar from './NavBar';

import { useNavigate } from 'react-router-dom';


const StudentDetails = () => {

    const email1 = localStorage.getItem("email");

    const token = localStorage.getItem("token");

    const [student, setStudent] = useState([]);


    //here we are fetching the details of that Particular Student Based on The Email.

    useEffect(() => {
        const fetchingdata = async () => {
            try {


                const response = await fetch(
                    `http://localhost:5049/api/Admin/ByEmail/${email1}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("We Are Facing Issue In order To get The Data");
                }

                const data = await response.json();
                setStudent(data);
            } catch (error) {
                alert(error);
            }
        };

        fetchingdata();
    }, []);


    const navigate = useNavigate();

    const handlehome = () => {
        navigate("/student/course/:id");
    }




    return (

        <>
            <Navbar />


            <button onClick={handlehome} className='o6'>Back To Home</button>
            <div className='o1'>

                <div key={student.studentId} className='o2'>

                    <table className='o3'>
                        <thead className='o4'>
                            <tr>
                                <th>Info</th>
                                <th>Deatils</th>
                            </tr>
                        </thead>
                        <tbody className='o5'>
                            <tr>
                                <td>Student Id</td>
                                <td>{student.studentId}</td>
                            </tr>
                            <tr>
                                <td>Full Name</td>
                                <td>{student.fullName}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{student.email}</td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>{student.password}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{student.phone}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>{student.address}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div >




        </>

    )
}

export default StudentDetails