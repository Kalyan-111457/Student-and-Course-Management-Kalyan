

import React, { useEffect, useState } from "react";
import "./Css/AllCoursesAndEnrollments.css";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AllEnrolledStudents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchEnrolledData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5049/api/Admin/AllStudentEnrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching enrolled student data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="g5">
        <h2>
          <button onClick={() => navigate("/SideBar")} className="v92">
            <FaArrowLeft size={20} />
          </button>
          All Enrolled Students
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search Students"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "15px", padding: "5px", width: "300px" }}
        />

        {loading && <h3>Loading...</h3>}
        {error && <h3 style={{ color: "red" }}>{error}</h3>}
        {!loading && data.length === 0 && <p>No students found.</p>}

        {data
          .filter((student) =>
            student.studentName.toLowerCase().includes(search.toLowerCase())
          )
          .map((student) => (
            <div className="g1" key={student.studentId}>
              <h3>Student: {student.studentName}</h3>
              <p>Email: {student.studentEmail}</p>

              <h4>Enrolled Courses:</h4>
              <div className="g8">
                <table
                  className="g2"
                  border="1"
                  cellPadding="10"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead className="g3">
                    <tr>
                      <th>Course ID</th>
                      <th>Course Name</th>
                      <th>Capacity</th>
                      <th>Enrolled Count</th>
                      <th>Available Seats</th>
                    </tr>
                  </thead>
                  <tbody className="g4">
                    {student.enrolledCourses.map((course) => (
                      <tr key={course.courseId}>
                        <td>{course.courseId}</td>
                        <td>{course.courseName}</td>
                        <td>{course.capacity}</td>
                        <td>{course.enrolledCount}</td>
                        <td>{course.availableSeats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AllEnrolledStudents;
