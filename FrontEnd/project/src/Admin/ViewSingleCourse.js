import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Css/ViewSingleCourse1.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // import icons



const ViewSingleCourse = ({ courses = [] }) => {

    const { id } = useParams();

    const singleCourse = courses.find((item) => item.courseId == id);

    const token = localStorage.getItem("token");

    const navigate = useNavigate();


    // Enrolled Students
    const [enrolledStudents, setEnrolledStudents] = useState(null);

    // Fetch enrolled students
    useEffect(() => {
        const fetchEnrolledStudents = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5049/api/Admin/EnrolledStudentsByCourseId/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                );

                if (!response.ok) throw new Error("Failed to fetch enrolled students");

                const data = await response.json();
                setEnrolledStudents(data);

            } catch (err) {
                alert(err.message);
            }
        };

        fetchEnrolledStudents();
    }, [id]);

    // Delete handler
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://localhost:5049/api/Course/DeleteById/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }
            );

            if (!response.ok) throw new Error("Failed to delete course");

            alert("Course deleted successfully!");
            navigate("/SideBar");

        } catch (err) {
            alert(err.message);
        }
    };



    

    // If course not found
    if (!singleCourse) return <p>No course found.</p>;

    return (
        <>
            <NavBar />
                           

            <div className='l1'>
                
                    <button onClick={() => navigate("/SideBar")} className="nav-btn">
                    <FaArrowLeft size={18} />
                     </button>

                <h1>Course Name: {singleCourse.courseName}</h1>
                <p>Course Description: {singleCourse.courseDescription}</p>

                <p><strong>Course ID:</strong> {singleCourse.courseId}</p>
                <p><strong>Capacity:</strong> {singleCourse.capacity}</p>
                <p><strong>Enrolled Students:</strong> {singleCourse.enrolledCount}</p>
                <p><strong>Available Seats:</strong> {singleCourse.availableSeats}</p>

                <Link to={`/EditPost/${singleCourse.courseId}`}>
                    <button className='l2'>
                        <FaEdit size={16} />
                        Edit
                    </button>
                </Link>

                <button onClick={() => handleDelete(singleCourse.courseId)} className="l3">
                    <FaTrash size={16} />
                    Delete
                </button>



                <hr />

                <h2 id="l4">Students Enrolled in This Course</h2>

                {enrolledStudents?.students?.length > 0 ? (
                    <div className='l8'>
                        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }} className='l5'>
                            <thead className='l6'>
                                <tr >
                                    <th>Student ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Enrolled On</th>
                                </tr>
                            </thead>

                            <tbody className='l7'>
                                {enrolledStudents.students.map((s) => (
                                    <tr key={s.studentId}>
                                        <td>{s.studentId}</td>
                                        <td>{s.fullName}</td>
                                        <td>{s.email}</td>
                                        <td>{s.phone}</td>
                                        <td>{s.enrolledOn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No students enrolled yet.</p>
                )}
            </div>
        </>
    );
};

export default ViewSingleCourse;
