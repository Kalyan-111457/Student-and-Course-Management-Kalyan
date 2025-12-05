import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import "./css/MyEnrollmentscss1.css";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const [enrolled, setEnrolled] = useState([]);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const studentId = localStorage.getItem("studentId");


  //here i am passing  studentId as Localstorage and passing in it 

  useEffect(() => {
    if (!studentId) return;

    const fetchEnrolled = async () => {
      try {
        const res = await fetch(
          `http://localhost:5049/api/Student/MyEnrollements/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        console.log("Enrollment Response:", data);

        if (data.Message) {
          setMessage(data.Message);
          setEnrolled([]);
        } else {
          setMessage("");
          setEnrolled(data.enrolledCourses || data.EnrolledCourses || []);
        }
      } catch (err) {
        console.error("Enrollment Fetch Error:", err);
      }
    };

    fetchEnrolled();
  }, [studentId, token]);


  //here we have to handle the uneroll the course  we have to pass two things courseid as button function we are passsing StudentId as localStrorage

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll?")) return;

    const res = await fetch("http://localhost:5049/api/Student/UnEnrolleCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ StudentId1: studentId, CourseId1: courseId })
    });

    if (res.ok) {
      setEnrolled(enrolled.filter(c => c.courseId !== courseId));
      alert("Unenrolled successfully!");
    }
  };

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/student/course/:id");
  };

  return (
    <div className="pm99">
      <Navbar />

      <h2 className="pk6-container">My Enrolled Courses</h2>
      <button onClick={handleHome} className="pk5">Back To Home</button>

      {message && <p>{message}</p>}

      {enrolled.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <div className="enrolled-card-container">
          {enrolled.map((course) => (
            <div className="enrolled-card" key={course.courseId}>
              <h3>{course.courseName}</h3>
              <p><strong>Description:</strong> {course.courseDescription}</p>

              <button 
                className="unenroll-btn"
                onClick={() => handleUnenroll(course.courseId)}
              >
                Unenroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
