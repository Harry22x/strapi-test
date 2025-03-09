import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar({ user }) {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <i className="ti ti-layout-dashboard logo-icon" />
          <div className="logo-text">Dashboard</div>
        </div>

        <div className="nav-items">
          {user?.role === "Organizer" && (
            <Link to="/organizer-dashboard">
              <div className="nav-item">
                <i className="ti ti-home nav-icon" />
                <div className="nav-text">Home</div>
              </div>
            </Link>
          )}

          {user?.role === "Attendee" && (
            <Link to="/attendee-dashboard">
              <div className="nav-item">
                <i className="ti ti-home nav-icon" />
                <div className="nav-text">Home</div>
              </div>
            </Link>
          )}

          <Link to="/profile">
            <div className="nav-item">
              <i className="ti ti-user nav-icon" />
              <div className="nav-text">Profile</div>
            </div>
          </Link>

          {user?.role === "Organizer" && (
            <Link to="/attendee-dashboard">
              <div className="nav-item">
                <i className="ti ti-clipboard nav-icon" />
                <div className="nav-text">Attending Events</div>
              </div>
            </Link>
          )}
        </div>

        <div className="bottom-nav">
          <div className="nav-item">
            <i className="ti ti-settings nav-icon" />
            <div className="nav-text">Settings</div>
          </div>

          <div className="nav-item">
            <i className="ti ti-help nav-icon" />
            <div className="nav-text">Support</div>
          </div>

          <div className="nav-item">
            <i className="ti ti-shield-lock nav-icon" />
            <div className="nav-text">Privacy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
