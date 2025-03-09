import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useOutletContext } from "react-router-dom";
import "./Calender.css"; // Import the CSS file

function Calender() {
  let [onLogin, user] = useOutletContext();
  let usedEvents = new Set();
  let dates = [];

  if (user?.user_tickets) {
    user.user_tickets.forEach((data) => {
      if (!usedEvents.has(data.event_ticket.event.id)) {
        usedEvents.add(data.event_ticket.event.id);
        dates.push({
          title: data.event_ticket.event.name,
          date: data.event_ticket.event.date,
        });
      }
    });
  }

  const handleDateClick = (arg) => {
    console.log("Date clicked:", arg);
  };

  return (
    <main className="calendar-container">
      <div className="calendar-box">
        <h1 className="calendar-heading">
          This calendar shows you when your upcoming events are taking place:
        </h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          dateClick={handleDateClick}
          initialView="dayGridMonth"
          weekends={true}
          events={dates}
        />
      </div>
    </main>
  );
}

export default Calender;
