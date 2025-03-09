import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useOutletContext } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Public");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [onLogin, user, check_session] = useOutletContext();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

   
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Strapi registration endpoint
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          // You can add custom fields if you've extended the user model
          
        }),
      });
  
      const data = await response.json();
      
      if (data.error) {
        console.error(data.error);
        setError(data.error.message || "Registration failed. Please try again.");
        return;
      }
  
      // Successful registration returns jwt and user
      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        
        // If you need to check user role and redirect
        const userRole = data.user.role?.name || "Authenticated";
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSignup} className="bg-white p-6 shadow-md rounded-lg space-y-4">
          <input
            type="text"
            id="username"
            className="signup-input w-full p-2 border rounded-lg"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            id="email"
            className="signup-input w-full p-2 border rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            className="signup-input w-full p-2 border rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input w-full p-2 border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
    
          <button type="submit" className="btn w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
