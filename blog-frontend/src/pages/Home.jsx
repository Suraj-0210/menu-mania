import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6">Welcome to MenuMania</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          MenuMania is your ultimate solution to streamline your restaurant’s
          menu management and enhance your customers&apos; dining experience.
        </p>
        {currentUser ? (
          <Link
            to="/restaurants"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all Restaurants
          </Link>
        ) : (
          <>
            <p>Ready to get started?</p>
            <Link
              to="/signin"
              className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
            >
              Start your first step by logging in now!
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
