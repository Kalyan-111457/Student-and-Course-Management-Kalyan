    import { useEffect, useState } from "react";
    import Navbar from "./NavBar";
    import "./css/CourseDetailscss1.css";

    const StudentHome = () => {
        const [courses, setCourses] = useState([]);
        const [search, setSearch] = useState("");
        const token = localStorage.getItem("token");
        const studentId = localStorage.getItem("studentId");


        //Fetching all Courses Data

        useEffect(() => {
            const fetchCourses = async () => {
                const response = await fetch("http://localhost:5049/api/Course/GetAllCourses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setCourses(data);
            };
            fetchCourses();
        }, [token]);


        //here we are hadling enroll in that passing two thing one studentId come form locvalstorage another one form the function
        const handleEnroll = async (courseId) => {
            try {
                const response = await fetch("http://localhost:5049/api/Student/EnrollCourse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ StudentId1: studentId, CourseId1: courseId }),
                });

                if (response.ok) {
                    alert("Enrolled successfully!");
                    window.location.reload();
                } else {
                    const err = await response.json();
                    alert(err.message);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to enroll");
            }
        };

        const filteredCourses = courses
            .filter(course => course.availableSeats > 0)
            .filter(course =>
                course.courseName.toLowerCase().includes(search.toLowerCase())
            );

        return (
            <div>
                <Navbar />
                <hr />

                <h2 className="pu1">Student Dashboard</h2>

                <div className="pu2">
                    <h2>All Courses</h2>

                    {/* Search input */}
                    <div className="pu3">
                        <input
                            type="text"
                            placeholder="Search course..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Card container */}
                    <div className="course-card-container">
                        {filteredCourses.map((course) => (
                            <div className="course-card" key={course.courseId}>
                                <h3>{course.courseName}</h3>
                                <p><strong>ID:</strong> {course.courseId}</p>
                                <p><strong>Description:</strong> {course.courseDescription}</p>
                                <p><strong>Available Seats:</strong> {course.availableSeats}</p>

                                <button className="enroll-btn" onClick={() => handleEnroll(course.courseId)}>
                                    Enroll
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    export default StudentHome;
