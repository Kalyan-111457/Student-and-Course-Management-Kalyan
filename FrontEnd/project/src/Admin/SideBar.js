import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Css/sidebarcode1.css';
import NavBar from './NavBar';

const SideBar = () => {

  const username = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrolledStudents: 0,
    totalNotEnrolledStudents: 0,
    totalEnrollments: 0,
    courses: []
  });

  const [loading, setLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    
    const fetchStats = async () => {

      try {

        const response = await fetch('http://localhost:5049/api/Admin/GetCourseStats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {

          throw new Error('Failed to fetch stats');

        }
        const data = await response.json();

        setStats({
          totalCourses: data.totalCourses || 0,
          totalStudents: data.totalStudents || 0,
          totalEnrolledStudents: data.totalEnrolledStudents || 0,
          totalNotEnrolledStudents: data.totalNotEnrolledStudents || 0,
          totalEnrollments: data.totalEnrollments || 0,
          courses: data.courses || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="uk6">
      <NavBar />

      <div className="uk7">
        {/* Sidebar */}
        <aside className="uk1">
          <img
            src="https://png.pngtree.com/png-vector/20240809/ourmid/pngtree-businesswoman-with-headset-clipart---3d-illustration-png-image_13419271.png"
            alt="User"
            className="profile-img"
          />
          <ul className="uk2">
            <p className="username">Hi {username}</p>
            <li><Link to="/CreateCourse">Create Course</Link></li>
            <li><Link to="/AllEnrolledStudents">All Courses & Enrolled Students</Link></li>
            <li><Link to="/AllStudents">All Students</Link></li>
            <li><Link to="/StudentCreation">Create Student</Link></li>
          </ul>
        </aside>

        {/* Right Content */}
        <section className="uk3">
          <h2 className="uk4">Welcome To Admin Dashboard</h2>

          <div className="uk5">
            <h1>Overall Stats</h1>

            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search Courses"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ marginBottom: '15px', padding: '5px', width: '300px' }}
                />

                {/* Overall Stats Table */}
                <table border="1" className="stats-table">
                  <thead>
                    <tr>
                      <th>Total Courses</th>
                      <th>Total Students</th>
                      <th>Enrolled Students</th>
                      <th>Not Enrolled Students</th>
                      <th>Total Enrollments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{stats.totalCourses}</td>
                      <td>{stats.totalStudents}</td>
                      <td>{stats.totalEnrolledStudents}</td>
                      <td>{stats.totalNotEnrolledStudents}</td>
                      <td>{stats.totalEnrollments}</td>
                    </tr>
                  </tbody>
                </table>

                <h2>Per-Course Enrollment</h2>
                {stats.courses.filter(course =>
                  course.courseName.toLowerCase().includes(search.toLowerCase())
                ).length === 0 ? (
                  <p>No course data available.</p>
                ) : (
                  <table border="1" className="stats-table">
                    <thead>
                      <tr>
                        <th>Course Id</th>
                        <th>Course Name</th>
                        <th>Capacity</th>
                        <th>Enrolled Count</th>
                        <th>Available Seats</th>
                        <th>View Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.courses
                        .filter(course =>
                          course.courseName.toLowerCase().includes(search.toLowerCase())
                        )
                        .map(course => (
                          <tr key={course.courseId}>
                            <td>{course.courseId}</td>
                            <td>{course.courseName}</td>
                            <td>{course.capacity}</td>
                            <td>{course.enrolledCount}</td>
                            <td>{course.availableSeats}</td>
                            <td>
                              <Link to={`/ViewSingleCourse/${course.courseId}`}>
                                <button>View Data</button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      
    </div>
  );
};

export default SideBar;
