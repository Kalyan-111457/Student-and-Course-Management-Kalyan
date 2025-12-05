import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/Login1css.css';

export default function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // clear old token on page load
  useEffect(() => {

    localStorage.removeItem("token");
    localStorage.removeItem("email");

  }, []);

  async function handleLogin(e) {

    e.preventDefault();

    const body = {
      userName: email,
      password: password
    };

    //Here we are passing username and password  if valid it will navigate otherwise it will generate the Invalid Cendetilals

    try {
      const res = await fetch("http://localhost:5049/api/Authorize/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Invalid Credentials");
        return;
      }

      // get token from backend
      const response = await res.json();
      const token = response.token;

      // store in local storage
      localStorage.setItem("token", token);

      // decode token manually (like your required method)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      const username = payload.unique_name || payload.name;

      // save username
      localStorage.setItem("email", username);

      // navigate based on role
      if (role === "Admin") return navigate("/SideBar");
      if (role === "Student") return navigate("/student/course/:id");

      alert("Unknown role");
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  }

  return (
    <>
      <h2 className="pk121">Student Registration Portal</h2>
      <div className="pk11">
        <h2>Login</h2>

        <form className="pk12" onSubmit={handleLogin}>
          <label >Email:</label>
          <input
            type="text"
            className="add-input"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label >Password:</label>
          <input
            type="password"
            className="add-input"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="pk13">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
