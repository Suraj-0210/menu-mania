import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const { currentUser } = useSelector((state) => state.user);

  // Array of images to rotate through
  const images = [
    "https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/09/14/11/43/restaurant-939435_640.jpg",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [images.length]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 p-8 sm:p-12 md:p-16 lg:p-28 px-3 max-w-6xl mx-auto h-[calc(100vh-60px)]">
      {/* Left section (Text content) */}
      <div className="flex-1 flex flex-col justify-center gap-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 animate-slide-up">
          Welcome to <span className="text-teal-500">MenuMania</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg animate-fade-in-delayed">
          MenuMania is your ultimate solution to streamline your restaurant’s
          menu management and enhance your customers&apos; dining experience.
        </p>
        {currentUser ? (
          <Link
            to="/restaurants"
            className="text-sm sm:text-base lg:text-lg text-teal-500 font-bold hover:underline transition-transform transform hover:scale-105 duration-200 ease-in-out animate-bounce-in"
          >
            View all Restaurants
          </Link>
        ) : (
          <>
            <p className="animate-fade-in-delayed">Ready to get started?</p>
            <Link
              to="/signin"
              className="text-sm sm:text-base lg:text-lg text-teal-500 font-bold hover:underline transition-transform transform hover:scale-105 duration-200 ease-in-out animate-bounce-in"
            >
              Start your first step by logging in now!
            </Link>
          </>
        )}
      </div>

      {/* Right section (Image slideshow) */}
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

export default Home;
