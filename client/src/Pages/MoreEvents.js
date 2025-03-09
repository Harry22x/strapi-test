import React, { useState, useEffect } from "react";
import "./MoreEvents.css";
import EventCard from "../components/EventCard";

const MoreEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Error loading events. Please try again.");
        console.error("Fetch error:", err);
      }
    };

    fetchEvents();
  }, []);

  // Function to filter events based on any available string detail
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return Object.values(event || {}).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(query)
    );
  });

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="events-container">
      <h2 className="events-title">Event Tickets</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search event..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="tickets-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ticket) => <EventCard key={ticket.id} {...ticket} />)
        ) : (
          <p className="no-results">No matching events found.</p>
        )}
      </div>
    </section>
  );
};

export default MoreEvents;
