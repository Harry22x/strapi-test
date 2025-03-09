import React from "react";
import { Link } from "react-router-dom"; // ✅ Use Link for valid navigation
import './LandingPage.css';
import UpcomingEvents from "./UpcomingEvents";
import AddTicket from "./AddTicket";
import image1 from '../images/image1.jpeg';
import Reviews from "../components/Reviews";
import { useOutletContext } from "react-router-dom";

export default function LandingPage() {
  let [onLogin,user] = useOutletContext();
  return (
    <div className="landing-container">
      <main className="main-content">
      <img
        src={image1} 
        alt="K-pop Group"
        loading="lazy"
        className="hero-image"
      />
        <div className="content-wrapper">
          <h1 className="title">Unwind, Sip, and Vibe! </h1>
          <p className="description">
          Immerse yourself in a chill atmosphere where smooth tunes meet your favorite drinks. Whether you're here for laid-back conversations or just soaking in the good vibes, this event is your perfect escape. Relax, connect, and make unforgettable memories!"
          </p>

          <div className="button-group">
            <Link to={`/events/1`}>
            <a href="#" className="secondary-btn">
              Learn More
            </a>
            </Link>
          </div>
        </div>
      </main>
      <UpcomingEvents key="upcoming-events" />
      {user && user.role=="Organizer" ? ( <AddTicket key="add-ticket" />):(null)}
     <Reviews/>
    </div>
  );
}
