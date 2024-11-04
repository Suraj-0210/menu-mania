import { useState } from "react";
import emailjs from "emailjs-com";

function Contact() {
  // Array of customer support or contact-related images
  const images = [
    "https://cdn.pixabay.com/photo/2019/02/17/18/26/handshake-4002834_1280.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS Template ID
        {
          subject: formData.name, // Setting the name as the email subject
          message: formData.message,
          to_email: "kantaprustys@gmail.com", // Email recipient
          from_email: formData.email,
          from_name: formData.name,
        },
        "YOUR_USER_ID" // Replace with your EmailJS User ID
      )
      .then(() => {
        setIsSent(true);
        setError(null);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        setError("Failed to send the email. Please try again.");
      });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 sm:p-8 md:p-12 lg:p-20 max-w-6xl mx-auto bg-white dark:bg-gray-900">
      {/* Left section (Contact form and details) */}
      <div className="flex-1 flex flex-col justify-center gap-6 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 animate-slide-up">
          Contact <span className="text-teal-500">MenuMania</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg animate-fade-in-delayed">
          We'd love to hear from you! Whether you have a question about
          features, pricing, or anything else, our team is ready to answer all
          your questions.
        </p>

        {/* Contact Form */}
        <form className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Your Message"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-teal-500 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-600 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right section (Image slideshow and contact info) */}
      <div className="flex flex-col items-center justify-center md:justify-start md:w-1/2 space-y-4">
        <div className="w-full h-64 sm:h-80 md:h-full relative">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Contact Slide ${index}`}
              className={`w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                position: index === currentImageIndex ? "relative" : "absolute",
                top: 0,
                left: 0,
              }}
            />
          ))}
        </div>
        {/* Contact Info */}
        <div className="mt-4 text-center md:text-left text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
          <p>📍 Address: LIG 1/7, Chandrasekharpur, Bhubaneswar</p>
          <p>📧 Email: kantaprustys@gmail.com</p>
          <p>📞 Phone: +91 98279 23428</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
