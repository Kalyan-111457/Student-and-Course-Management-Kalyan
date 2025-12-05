/* import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Css/AllCourses1.css';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import NavBar from './NavBar';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // import icons


const AllCourses = ({ courses = [], search, setSearch, loading }) => {


    useEffect(() => {
        if (!loading && courses.length === 0) {
            alert("No Course Found");
            window.location.reload(); // use carefully, this will reload the page
        }
    }, [loading, courses]);


    const navigate = useNavigate();





    return (
        <>
            <NavBar />

            <div className='k2'>



                {loading && <p>Loading courses...</p>}




                {!loading && courses.length > 0 && (

                    <>
                        <div className='k99'>




                            <form className='k3'>
                                <button onClick={() => navigate("/SideBar")} className="nav-btn">
                                    <FaArrowLeft size={20} /> 
                                </button>


                                <input type='text'
                                    autoFocus
                                    placeholder='Enter The Course Name'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />




                            </form>




                            <table border="1" className='k1'>
                                <thead className='k4'>
                                    <tr>
                                        <th>Course Id</th>
                                        <th>Course Name</th>
                                        <th>Capacity</th>
                                        <th>Enrolled Count</th>
                                        <th>AvailableSeats</th>
                                        <th> Data Button</th>
                                    </tr>
                                </thead>
                                <tbody className='k5'>



                                    {courses.map((item) => (



                                        <tr key={item.courseId}>

                                            <td>{item.courseId}</td>
                                            <td>{item.courseName}</td>
                                            <td>{item.capacity}</td>
                                            <td>{item.enrolledCount}</td>
                                            <td>{item.availableSeats}</td>
                                            <td>



                                            </td>


                                        </tr>


                                    ))}


                                </tbody>
                            </table>
                        </div>


                    </>

                )

                }


            </div>
        </>
    )
}

export default AllCourses */