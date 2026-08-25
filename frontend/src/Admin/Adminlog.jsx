import { useState } from 'react';
import '../admincss/adminlog.css';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const Adminlog = () => {
  const navigate = useNavigate();

  const [AdminLogin, setalogin] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setalogin({
      ...AdminLogin,
      [e.target.name]: e.target.value
    });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://jon-available.onrender.com/api/admin-login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(AdminLogin)
      });

      const data = await res.json();

      if (res.status === 200) {
        // Sirf admin ke data ko stringify karke local storage me save kar rahe hain
        localStorage.setItem("admin", JSON.stringify(data.admin));
        
        // Dashboard par redirect
        navigate("/admindash");
      } else {
        // Backend se jo error message aayega wo alert hoga (e.g., "Admin not found" ya "Invalid password")
        alert(data.message);
      }

    } catch (err) {
      console.log("Frontend Error:", err);
      alert("Server se connect nahi ho pa raha hai. Check karo backend chal raha hai ya nahi!");
    }
  };

  return (


    <div>
      <Nav/>
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>Admin Login</h1>

        <form onSubmit={HandleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={AdminLogin.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={AdminLogin.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Adminlog;