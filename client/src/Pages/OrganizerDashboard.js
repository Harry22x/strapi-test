"use client";
import React from "react";
import styles from "./Dashboard.module.css";
import SideBar from "../components/SideBar";
import MyEventCard from "../components/MyEventCard";
import { Link,useOutletContext,useNavigate} from "react-router-dom";
import AddTicket from "./AddTicket";

function Dashboard() {
    let [onLogin,user] = useOutletContext();
    let used_events=[];
    const navigate = useNavigate()
    
    if (!user) {
        return (
            <div className="account-loader">
              <div className="spinner"></div>
            </div>
        );
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
        
        
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }} className="app-layout">
  
          <SideBar user={user} />
                                  
          <main className={styles.container2}>
            <section className={styles.projectsSection}>
              <h2 className={styles.sectionTitle}>Your Events</h2>
              {user.user_events.length > 0 ? (null):(<h1>This is where your hosted events would show but you are currently not hosting any</h1>)}
              <div className={styles.projectsGrid}>
              {user.role == 'Organizer' ? (
            <>
            {user.user_events.map((data) =><MyEventCard key={data.event.id} id={data.event.id} name={data.event.name} description={data.event.description}
             time={data.event.time} image={data.event} date={data.event.date} location={data.event.location} event_tickets={data.event.event_tickets}/>)}
            
            </>
        ):(null)}
        
              </div>
            </section>
  
            <aside className={styles.rightSidebar}>
            <article className={styles.announcementItem}>
            <h4 className={styles.announcementTitle}>Make your own Events!</h4>
            <p className={styles.announcementText}>Have an idea for an amazing event? Whether it's a music concert, a workshop, or a social gathering, you can create and manage your own event effortlessly. Set the details, share with your audience, and make it an experience to remember. Start planning today!</p>
            <Link to="/create-event">
                            <button className="create-button">Create Events</button>
                          </Link>
                                 
            </article>
              
            </aside>
          </main>
          
        
        </div>
        {/* {user.role !=="Organizer" ? (navigate(`/`)):(null)} */}
      </>
    );
  }


export default Dashboard;