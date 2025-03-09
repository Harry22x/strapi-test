import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-indigo-700 px-6 py-16">
      <div className="max-w-3xl w-full bg-white text-gray-900 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-indigo-700">Get in Touch</h2>
        <p className="text-center text-gray-600 mt-3">
          Have questions or feedback? Drop us a message!
        </p>

        {/* Contact Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring focus:ring-indigo-300 shadow-sm transition duration-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring focus:ring-indigo-300 shadow-sm transition duration-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring focus:ring-indigo-300 shadow-sm transition duration-300 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105"
          >
            <FaPaperPlane className="mr-2" />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;


