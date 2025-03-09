import EventCard from "../components/EventCard";
import styles from "./Dashboard.module.css";
import { useOutletContext} from "react-router-dom";
function AttendeeEventCard(){
let used_events = []
let [onLogin,user] = useOutletContext();
    return(
        <>
        {user.user_tickets.map((data, index) => {            
         
         
            if(!used_events.includes(data.event_ticket.event.id)){
                   used_events.push(data.event_ticket.event.id)
                   return (<>
   
                   
                 <EventCard key={index} {...data.event_ticket.event} />
                    <h1  className={styles.projectTitle}>Tickets bought:</h1>
     
                   <h1  className={styles.projectTitle}>{data.ticket_quantity} {data.event_ticket.ticket_type}</h1>
                    </>
                  )
               }
               return (<h1 className={styles.projectTitle}>{data.ticket_quantity} {data.event_ticket.ticket_type}</h1>)
             })}
             </  >
    )

}

export default AttendeeEventCard