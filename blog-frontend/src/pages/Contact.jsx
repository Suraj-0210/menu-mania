import { useState } from "react";

function Contact() {
  // Array of customer support or contact-related images
  const images = [
    "https://cdn.pixabay.com/photo/2019/02/17/18/26/handshake-4002834_1280.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse  md:flex-row gap-10 p-8 sm:p-12 md:p-16 lg:p-28 px-3 max-w-6xl mx-auto h-[calc(100vh-60px)]">
      {/* Left section (Contact form and details) */}
      <div className="flex-1 flex flex-col justify-center gap-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 animate-slide-up">
          Contact <span className="text-teal-500">MenuMania</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg animate-fade-in-delayed">
          We'd love to hear from you! Whether you have a question about
          features, pricing, or anything else, our team is ready to answer all
          your questions.
        </p>

        {/* Contact Form */}
        <form className="space-y-4 text-gray-600">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-600 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right section (Image slideshow) */}
      <div className="flex-col flex justify-end left-10 items-center relative">
        <div className="w-full mx-auto h-auto relative">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Contact Slide ${index}`}
              className={`w-full h-auto object-cover rounded-lg shadow-lg transition-opacity duration-1000 ease-in-out ${
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
        <div className="mt-6 text-sm sm:text-base lg:text-lg text-gray-600">
          <p>📍 Address: 1234 Culinary St., Food City, FC 56789</p>
          <p>📧 Email: support@menumania.com</p>
          <p>📞 Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
