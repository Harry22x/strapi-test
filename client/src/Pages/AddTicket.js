import React from "react";
import { Link } from "react-router-dom";
import "./AddTicket.css";

function AddTicket() {
  return (
    <div className="create-events-container">
      <div className="create-events-content">
        <div className="create-events-layout">
          <div className="image-column">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2c792f3bdbe1e6fca6ff29c6d92b0a2bc16c53240a960656083e5772cdb246f3?placeholderIfAbsent=true"
              className="event-image"
              alt="Illustration of event creation process"
            />
          </div>
          <div className="content-column">
            <div className="content-wrapper">
              <h1 className="main-heading">Create Your Own Event</h1>
              <p className="description">
                Want to organize a music concert, a workshop, or a gathering? 
                Easily create, manage, and share your event details with your audience. 
                Start planning today!
              </p>

              <Link to="/create-event">
                <button className="create-button">Create Event</button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTicket;
