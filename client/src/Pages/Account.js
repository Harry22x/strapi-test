import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import EventCard from "../components/EventCard";
import MyEventCard from "../components/MyEventCard";
import "./Account.css";
import "./LoadingAnimation.css";

function Account() {
  let [onLogin, user] = useOutletContext();

  // Prevent duplicates in event rendering
  const usedEvents = useMemo(() => new Set(), []);

  if (!user) {
    return (
      <div className="account-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <h2 className="account-heading">User Dashboard</h2>
      <h2 className="account-subheading">Hello {user.username}</h2>

      {/* Organizer Events Section */}
      {user?.role === "Organizer" && (
        <>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            My Events:
          </h1>

          {user?.user_events?.length > 0 ? null : (
            <h1>
              This is where your hosted events would show, but you are currently
              not hosting any.
            </h1>
          )}

          {user?.user_events?.map((data) => (
            <MyEventCard
              key={data.event.id}
              id={data.event.id}
              name={data.event.name}
              description={data.event.description}
              time={data.event.time}
              image={data.event}
              date={data.event.date}
              location={data.event.location}
            />
          ))}
        </>
      )}

      {/* Attendee Events Section */}
      <h3 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Attending Events:
      </h3>

      {user?.user_tickets?.length > 0 ? null : (
        <h1>
          This is where your attending events would show, but you are currently
          not attending any.
        </h1>
      )}

      <div style={{ display: "contents", gap: "100px", flexWrap: "wrap" }}>
        {user?.user_tickets?.map((data) => {
          const eventId = data.event_ticket.event.id;
          if (!usedEvents.has(eventId)) {
            usedEvents.add(eventId);
            return (
              <div key={eventId}>
                <EventCard {...data.event_ticket.event} />
                <h1 className="account-heading">Tickets Bought:</h1>
                <p className="account-ticket-info">
                  {data.ticket_quantity} {data.event_ticket.ticket_type}
                </p>
              </div>
            );
          }
          return (
            <h6 key={`${eventId}-${data.ticket_quantity}`} className="account-ticket-info">
              {data.ticket_quantity} {data.event_ticket.ticket_type}
            </h6>
          );
        })}
      </div>
    </div>
  );
}

export default Account;
