import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NavBar from "./NavBar";
import './Css/AllStudents1.css';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5049/api/Admin/AllStudents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("We are facing an error while fetching student data.");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`http://localhost:5049/api/Admin/Delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to delete student");

      // Update state locally instead of reloading
      setStudents((prev) => prev.filter((s) => s.studentId !== id));
      alert("Student deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="s2">
        <div className="s29">
          <form className="s3">
            <button
              type="button"
              onClick={() => navigate("/SideBar")}
              className="nav-btn"
              aria-label="back-button"
            >
              <FaArrowLeft size={20} />
            </button>

            <input
              type="text"
              autoFocus
              placeholder="Enter The Student Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <h2>Student Details</h2>

        {loading && <h3>Loading…</h3>}
        {error && <h3 style={{ color: "red" }}>{error}</h3>}
        {!loading && !error && <h3>Total Students: {filteredStudents.length}</h3>}

        <div className="s1">
          <table border="1" cellPadding="8" className="s4">
            <thead className="s5">
              <tr>
                <th>StudentId</th>
                <th>FullName</th>
                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>DateTime</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody className="s6">
              {filteredStudents.map(student => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.password}</td>
                  <td>{student.phone}</td>
                  <td>{student.address}</td>
                  <td>{student.role}</td>
                  <td>{student.datetime}</td>
                  <td>
                    <Link to={`/EditeStudent/${student.studentId}`} state={{ student }}>
                      <button>Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(student.studentId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllStudents;
