import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./Pages/Footer";

function App() {
  const [user, setUser] = useState(null);

  async function check_session(token) {
    //console.log("Checking session")
    try {
      //console.log("Checking session with token:", token); // Debugging

      const response = await fetch("http://localhost:1337/api/users/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        //console.log("Session Valid:", userData);
        setUser(userData);
        //console.log(userData)
        return userData;
      } else {
        console.error("Session check failed:", response.status);
        const errorData = await response.json();
        console.error("Error data:", errorData);
        setUser(null);
        localStorage.removeItem("jwt"); // Remove invalid token
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
      localStorage.removeItem("jwt");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && token !== "null") {
      check_session(token);
    } else {
      localStorage.removeItem("jwt"); // Ensure no "null" string is stored
    }
  }, []);

  return (
    <>
      <header>
        <Navbar setUser={setUser} user={user} />
      </header>
      <Outlet context={[setUser, user, check_session]} />
      <Footer />
    </>
  );
}

export default App;
