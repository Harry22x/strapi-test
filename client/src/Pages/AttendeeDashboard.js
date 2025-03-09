"use client";
import React from "react";
import styles from "./Dashboard.module.css";
import SideBar from "../components/SideBar";
import EventCard from "../components/EventCard";
import { useOutletContext } from "react-router-dom";

function AttendeeDashboard() {
  let [onLogin, user,check_session] = useOutletContext();
  let usedEvents = new Set(); // Use Set to avoid duplicates

  if (!user) {
    return (
      <div className="account-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  function deleteEvent(id){
    user.user_tickets.map((data)=>{
      if(data.event_ticket.event.id === id){
       fetch(`/user-tickets/${data.id}`,{
        method:"DELETE",
        headers: {
          "Content-Type": "application/json",
        },
       })
       .then(check_session(localStorage.getItem("jwt")));
      }
    })
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Wrapper container with flexbox */}
      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }} className="app-layout">
        {/* Sidebar */}
        <SideBar user={user} />

        {/* Main content area */}
        <main className={styles.container}>
          <section className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>Your Attending Events:</h2>

            {user?.user_tickets?.length > 0 ? null : (
              <h1>This is where your attending events would show but you are currently not attending any</h1>
            )}

            <div className={styles.projectsGrid}>
              <div>
                
                <section style={{ backgroundColor: "#fff", boxShadow: "0 4px 6px #0000001a", borderRadius: "8px" }}>
                  {user?.user_tickets?.map((data, index) => {
                    if (!usedEvents.has(data.event_ticket.event.id)) {
                      usedEvents.add(data.event_ticket.event.id);
                      return (
                        <div key={index}>
                          <EventCard {...data.event_ticket.event} />
                          <h1  className={styles.projectTitle}><button className={styles.projectTitle} style={{backgroundColor:"#1D4ED8",color:"white",padding:"10px",borderRadius:"5px"}}onClick={()=>deleteEvent(data.event_ticket.event.id)}>Unattend event</button></h1> 
                          <h1 className={styles.projectTitle}>Tickets Bought:</h1>  
                         
                          <h1 className={styles.projectTitle}>
                            {data.ticket_quantity} {data.event_ticket.ticket_type}
                          </h1>
                       
                        </div>
                      );
                    }
                    return (
                      <h1 key={index} className={styles.projectTitle}>
                        {data.ticket_quantity} {data.event_ticket.ticket_type}
                      </h1>
                    );
                  })}
                </section>
              </div>
            </div>
          </section>

          <aside className={styles.rightSidebar}>
            {/* Announcements and trending sections */}
          </aside>
        </main>
      </div>
    </>
  );
}

export default AttendeeDashboard;