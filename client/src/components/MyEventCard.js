import React from "react";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import styles from "../Pages/Dashboard.module.css"
import './MyEventCard.css'

function MyEventCard({ name, location, id, time,description,image,date,event_tickets }) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [onLogin, user, check_session] = useOutletContext();
  
  let tickets_sold =event_tickets.map(data=>data.user_tickets[0] ? data.user_tickets[0].ticket_quantity:0)
  let revenue_generated = event_tickets.map(data=> data.user_tickets[0] ?Number(data.user_tickets[0].ticket_quantity) * Number(data.price):0)

  let remaining_tickets = event_tickets.map(data=>data.available_quantity)
  

  const validationSchema = yup.object().shape({
    eventName: yup.string().required("Event name is required"),
    location: yup.string().required("Location is required"),
    date: yup.string().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      eventName: name,
      location: location,
      date: date,
      time: time,
      description: description,
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrors([]);

      const formData = new FormData();
      formData.append("name", values.eventName);
      formData.append("description", values.description);
      formData.append("location", values.location);
      formData.append("date", values.date);
      formData.append("time", values.time);

      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        const response = await fetch(`/events/${id}`, {
          method: "PATCH",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to update event");

        const data = await response.json();
        setIsEditing(false);
        if (typeof check_session === "function") {
          check_session(localStorage.getItem("jwt"));
        }
      } catch (error) {
        setErrors([error.message]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("image", event.currentTarget.files[0]);
  };

  function handleDelete() {
    fetch(`/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      if (typeof check_session === "function") {
        check_session(localStorage.getItem("jwt"));
      }
    });
  }

  return (
    <article className={styles.projectCard}>
      <h3 className={styles.projectTitle}>{name}</h3>
      <p className={styles.projectDescription}>Description: {description}</p>
      <h6>Location: {location}</h6>
      <h6>Date: {date}</h6>
      <h6>Time: {time}</h6>
      <img src={image.image} alt="Event" style={{ width: "100px" }} />
      <Link to={`/events/${id}`}>
        <button className="form-button"  style={{ marginBottom: "10px" }}>
          View More Details
        </button>
      </Link>
      <br />
      {isEditing ? (
        <button className="form-button"  style={{ marginRight: "10px" }} onClick={() => setIsEditing(!isEditing)}>
          Cancel
        </button>
      ) : (
        <>
        <button className="form-button" style={{ marginRight: "10px" }}onClick={() => setIsEditing(!isEditing)}>
          Edit
        </button>
        
        </>
      )}
      <button className="form-button"  onClick={handleDelete}>
        Delete
      </button>
      <b><p>Tickets sold: {tickets_sold.reduce((value,sum)=>sum + value)}</p></b>
      <b><p>Revenue Generated: KES {revenue_generated.reduce((value,sum)=>sum + value)}</p></b>
      <b><p>Remaining Tickets:  {remaining_tickets.reduce((value,sum)=>sum + value)}</p></b>

      {isEditing && (
        <form style={{ maxHeight: "1000px", margin: "auto" }} onSubmit={formik.handleSubmit}>
          <label htmlFor="eventName">Event Name</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            autoComplete="off"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={formik.values.eventName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.eventName && formik.errors.eventName && <p>{formik.errors.eventName}</p>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && <p>{formik.errors.description}</p>}

          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            autoComplete="off"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.location && formik.errors.location && <p>{formik.errors.location}</p>}

          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            autoComplete="off"
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date && <p>{formik.errors.date}</p>}

              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                autoComplete="off"
                className="w-40 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.time && formik.errors.time && <p>{formik.errors.time}</p>}
              <br></br>
              <label htmlFor="time">image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className=" px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.image && formik.errors.image && <p>{formik.errors.image}</p>}
            
            
            

              <br></br>
              <button className="form-button"  variant="fill" color="primary" type="submit">
                {isLoading ? "Loading..." : "Submit"}
              </button>
            

            {errors.length > 0 && (
              <div> {errors.map((err) => (
                  <p >{err}</p>
                ))}</div>
               
              
            )}
          </form>
        
      )}
    </article>
  );
}

export default MyEventCard;
