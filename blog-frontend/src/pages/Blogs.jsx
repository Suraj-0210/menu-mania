import { useState } from "react";
import { Link } from "react-router-dom";

function Blogs() {
  // Array of blog-related images (or placeholder images)
  const images = [
    "https://cdn.pixabay.com/photo/2017/06/20/08/12/maintenance-2422172_640.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 p-8 sm:p-12 md:p-16 lg:p-28 px-3 max-w-6xl mx-auto h-[calc(100vh-60px)]">
      {/* Left section (Blog content) */}
      <div className="flex-1 flex flex-col justify-center gap-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 animate-slide-up">
          Blogs <span className="text-teal-500">Under Development</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg animate-fade-in-delayed">
          We are currently working on our blog section to provide you with
          valuable insights, updates, and articles related to the restaurant
          industry, food trends, and best practices for managing your restaurant
          business.
        </p>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg animate-fade-in-delayed">
          Stay tuned for exciting blog posts that will help you grow your
          business and enhance customer engagement!
        </p>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg animate-fade-in-delayed">
          In the meantime, feel free to explore our other features or connect
          with us to learn more about our platform.
        </p>
        <Link
          to="/contact"
          className="text-sm sm:text-base lg:text-lg text-teal-500 font-bold hover:underline transition-transform transform hover:scale-105 duration-200 ease-in-out animate-bounce-in"
        >
          Contact us for more information
        </Link>
      </div>

      {/* Right section (Image placeholder or slideshow) */}
      <div className="flex-1 flex justify-center items-center relative">
        <div className="w-full h-auto relative">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index}`}
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
      </div>
    </div>
  );
}

export default Blogs;
