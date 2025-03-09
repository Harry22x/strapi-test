import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ documentId, name, date, time, image,location }) => {
  const formattedDate = new Date(date).toDateString(); 

  return (
    <Link to={`/events/${documentId}`}>
      {console.log(image)}
      <div className="bg-white p-3 shadow-md h-full flex flex-col justify-between w-[27rem] mx-auto">
        <img src={image.url} alt={name} className="w-full rounded-md" />
        <h3 className="text-lg font-semibold mt-2">{name}</h3>
        <p className="text-lg font-semibold mt-2">{location}</p>
        <p className="text-xs text-gray-500 mt-1">{formattedDate} - {time}</p>
        
      </div>
    </Link>
  );
};

export default EventCard;

