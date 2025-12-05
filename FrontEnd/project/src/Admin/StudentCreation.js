import React, { useState } from 'react';
import './Css/CreateStudent.css';
import NavBar from './NavBar';

const StudentCreation = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Student");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { fullName, email, password, phone, address, role };

    try {
      const response = await fetch(
        "http://localhost:5049/api/Admin/StudentRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const json = await response.json();
        if (json.message) return alert(json.message);
        if (json.errors) return alert(Object.values(json.errors).flat().join("\n"));
        return alert("Something went wrong!");
      }

      alert("Student Registered Successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setRole("Student");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className='p11'>
        <form onSubmit={handleSubmit} className='p12'>
          <h2>Student Registration Page</h2>

          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            aria-label="full-name-input"
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="email-input"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="password-input"
          />

          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            minLength={10}
            aria-label="phone-input"
          />

          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            aria-label="address-input"
          />

          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="role-select"
          >
            <option value="Student">Student</option>
          </select>

          <button type="submit" className='p13' aria-label="register-student-button">
            Register Student
          </button>
        </form>
      </div>
    </>
  );
};

export default StudentCreation;
