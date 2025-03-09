import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./TicketPage.css";

const TicketPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <h2>Loading event details...</h2>;
  if (!event) return <h2>⚠️ Event not found</h2>;

  return (
    <div className="ticket-page-container">
      <h2 className="ticket-title">{event.title}</h2>
      <p className="ticket-date-time">{event.date} at {event.time}</p>
      <p className="ticket-description">{event.description}</p>
      <p className="ticket-price">Price: {event.price}</p>
      <button className="buy-ticket-btn">Buy Ticket</button>
    </div>
  );
};

export default TicketPage;
