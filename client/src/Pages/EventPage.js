import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import "./EventPage.css";
import "./LoadingAnimation.css"

function EventPage() {
  const { id } = useParams();
  const [{ data: event, error, status }, setEvent] = useState({
    data: null,
    error: null,
    status: "pending",
  });
  const [selectedTickets, setSelectedTickets] = useState({});
  const [phoneNumber, setPhoneNumber] = useState(254);
  const [errors, setErrors] = useState("");
  const [purchasebtn, setPurchasebtn] = useState("purchase tickets")
  const [message,setMessage] = useState("")
  let [onLogin, user,check_session] = useOutletContext();

  useEffect(() => {
    getevent()
  }, [id]);

 async function getevent(){
  try{const response = await fetch(`http://localhost:1337/api/events/${id}?populate=*`)
  const event = await response.json()

  if(response.ok){
    setEvent({ data: event.data, error: null, status: "resolved" })
  }}
 
  catch(err){  setEvent({ data: null, error: err.message, status: "rejected" });}


 }


 const handleTicketChange = (id, ticketType, price, change) => {
  setSelectedTickets((prev) => {
    const updatedTickets = { ...prev };
    if (updatedTickets[ticketType]) {
      updatedTickets[ticketType].quantity += change;
      updatedTickets[ticketType].id = id;

      if (updatedTickets[ticketType].quantity <= 0) delete updatedTickets[ticketType];
    } else if (change > 0) {
      updatedTickets[ticketType] = { quantity: 1, price, id };
    }
    return updatedTickets;
  });
};


  const totalAmount = Object.values(selectedTickets).reduce(
    (total, ticket) => total + ticket.quantity * parseFloat(ticket.price),
    0
  );

  async function purchase() {
    setPurchasebtn("Purchasing tickets...")
    setMessage("")
    try {
     
        
       
          await createUserTicket();
          await  redeucequantityavailable();
          setErrors(""); 
       
     
    } catch (error) {
      console.error("Error in purchase function:", error);
      setErrors("An error occurred. Please try again.");
    }
    setPurchasebtn("Purchase Tikcets")
    check_session(localStorage.getItem("jwt"))
    setMessage("Tickets successfully purchased!")
  }

  async function redeucequantityavailable() {
    for (let ticket in selectedTickets) {
      try {
        const response = await fetch(`http://localhost:1337/api/event-tickets/${selectedTickets[ticket].id}`);
        const ticketData = await response.json();
  
        if (response.ok) {
          const newAvailableQuantity = ticketData.data.available_quantity - selectedTickets[ticket].quantity;
  
          // Strapi v4 API structure
          await fetch(`http://localhost:1337/api/event-tickets/${selectedTickets[ticket].id}`, {
            method: "PUT", // Strapi uses PUT, not PATCH
            headers: {
              "Content-Type": "application/json",
               // Add authentication
            },
            body: JSON.stringify({
              
                available_quantity: newAvailableQuantity
              
            }),
          });
        } else {
          console.error("Failed to fetch ticket data:", ticketData);
        }
      } catch (error) {
        console.error("Error updating ticket quantity:", error);
      }
    }
  }


  async function createUserTicket() {
    for (let ticket in selectedTickets) {
      try {
        const response = await fetch(`http://localhost:1337/api/user-tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
             // Strapi v4 requires wrapping in a data object
              user: user.id,
              event_ticket: selectedTickets[ticket].id, // Check field name in your Strapi model
              ticket_quantity: selectedTickets[ticket].quantity,
            
          }),
        });
        
        if (response.ok) {
          console.log("success");
        } else {
          const errorData = await response.json();
          setErrors(errorData.error?.message || "Request failed");
          console.error("Failed to create user ticket:", errorData);
        }
      } catch (error) {
        console.error("Error creating user ticket:", error);
        setErrors("Failed to create user ticket. Please try again.");
      }
    }
  }
  function getAccessToken() {
    return fetch("/get-token")
      .then((response) => response.json())
      .then((data) => data.access_token)
      .catch((error) => {
        console.log("Error getting access token:", error);
        setErrors("Failed to get access token. Please try again.");
      });
  }

  function stkPush() {
    return fetch("/stk-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: Number(phoneNumber),
        amount: totalAmount,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("STK Push failed");
        }
        return response.json();
      })
      .then((result) => {
        console.log("STK Push Response:", result);
        return result;
      })
      .catch((error) => {
        console.log("Error sending STK Push:", error);
        setErrors("Failed to send STK Push. Please try again.");
        throw error;
      });
  }

  if (status === "pending") return <p className="loading">Loading event details...</p>;
  if (status === "rejected") return <p className="error">⚠️ Error: {error}</p>;

  return (
    <div className="event-container">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>
        <p className="event-date">{event.time} {new Date(event.date).toString().split("").splice(0,15).join("")} • {event.location}</p>
      </div>
      <div className="event-content">
        <div className="tickets-section">
          <h2 className="section-title">Tickets</h2>
          <div className="ticket-list">
          {(event?.event_tickets || []).map((ticket) => (
  <div className="ticket-card" key={ticket.id}>
    <div className="ticket-info">
      <p className="ticket-type">{ticket.ticket_type}</p>
      <p className="ticket-price">{parseFloat(ticket.price).toLocaleString()} KES</p>
    </div>
    <div className="ticket-actions">
      {ticket.available_quantity < 1 ? (
        <p className="sold-out">Sold Out</p>
      ) : (
        <>
          <button className="quantity-btn" onClick={() => handleTicketChange(ticket.documentId, ticket.ticket_type, ticket.price, -1)}>-</button>
          <span className="ticket-quantity">{selectedTickets[ticket.ticket_type]?.quantity || 0}</span>
          <button className="quantity-btn" onClick={() => handleTicketChange(ticket.documentId, ticket.ticket_type, ticket.price, 1)}>+</button>
        </>
      )}
    </div>
  </div>
))}

          </div>
          <p className="event-description">{event.description}</p>
        </div>

        <div className="total-section">
          <h2 className="section-title">Total</h2>
          <p className="total-tickets">Tickets: {Object.values(selectedTickets).reduce((sum, ticket) => sum + ticket.quantity, 0)}</p>
          <p className="total-price">Total: {totalAmount.toLocaleString()} KES</p>
          <b><label htmlFor="phone-number">*Enter phone number for M-pesa transaction:</label></b>
          <input id="phone-number" value={phoneNumber} className="phone-number" onChange={(e) => setPhoneNumber(e.target.value)}></input>
          <button className="purchase-button" onClick={() => purchase()}>{purchasebtn}</button>
          <p>{message}</p>
          {errors && <p className="error-message">{errors}</p>}
          <img className="event-image" src={event.image.url} alt="Event" />
        </div>
      </div>
    </div>
  );
}

export default EventPage;
