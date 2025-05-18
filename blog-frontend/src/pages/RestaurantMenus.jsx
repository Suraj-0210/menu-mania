import { useEffect, useState } from "react";
import { RestaurantSidebar } from "../components/RestaurantSidebar";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { MenuCards } from "../components/MenuCards";
import { AddDish } from "../components/AddDish";
import AddRestaurant from "../components/AddRestaurant";
import UpdateRestaurant from "../components/UpdateRestaurant";
import { useSelector } from "react-redux";
import Orders from "../components/Orders"; // Import Orders component

export const RestaurantMenus = (props) => {
  const restaurant = props.restaurant;
  const { currentUser } = useSelector((state) => state.user);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUpdateRestaurant, setIsUpdateRestaurant] = useState(false);
  const [createRestaurantSuccess, setCreateRestaurantSuccess] = useState("");
  const [updateRestaurantSuccess, setUpdateRestaurantSuccess] = useState("");
  const [isAddNew, setIsAddNew] = useState(false);
  const [showOrders, setShowOrders] = useState(false); // New state for toggling between menu and orders
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://menu-mania.onrender.com/api/menu/${restaurant._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
      restaurantid: restaurant._id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setCreateRestaurantSuccess(null);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image
    ) {
      return setErrorMessage("Please fill out all fields");
    }

    try {
      setFormLoading(true);
      const res = await fetch(
        "https://menu-mania.onrender.com/api/menu/createRecepie",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        setFormLoading(false);
        return setErrorMessage(data.message);
      }
      setFormLoading(false);
      if (res.ok) {
        navigate(0);
        handleClickAddNew();
      }
    } catch (error) {
      setErrorMessage(error.message);
      setFormLoading(false);
    }
  };

  const handleClickAddNew = () => {
    setIsAddNew((prevState) => !prevState);
  };
  const handleClickUpdateRestaurant = () => {
    setIsUpdateRestaurant((prevState) => !prevState);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
        setErrorMessage("Error uploading image");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, image: downloadURL }));
        });
      }
    );
  };

  // Function to toggle between Orders and Menu
  const toggleView = () => {
    setShowOrders((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="h-full mb-10">
        <RestaurantSidebar
          restaurant={restaurant}
          handleClickUpdateRestaurant={handleClickUpdateRestaurant}
          isUpdateRestaurant={isUpdateRestaurant}
        />
      </div>

      <div className="flex-1 justify-center mx-4 my-4">
        {/* Button to toggle between Orders and Menu */}
        <button
          onClick={toggleView}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg mb-4 shadow-md dark:bg-indigo-700"
        >
          {showOrders ? "View Orders" : "View Menu"}
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" className="text-indigo-600" />
          </div>
        ) : isUpdateRestaurant ? (
          <UpdateRestaurant
            currentUser={currentUser}
            restaurantId={restaurant._id} // Pass restaurantId as a prop
            setUpdateRestaurantSuccess={setUpdateRestaurantSuccess} // Set success message
            setErrorMessage={setErrorMessage}
            navigate={navigate}
            updateRestaurantSuccess={updateRestaurantSuccess}
            errorMessage={errorMessage}
          />
        ) : showOrders ? (
          <MenuCards
            isAddNew={isAddNew}
            handleClickAddNew={handleClickAddNew}
            restaurant={restaurant}
          />
        ) : !isAddNew && menu.length ? (
          <Orders restaurantid={restaurant._id} /> // Show Orders component when toggled
        ) : (
          <AddDish
            menu={menu}
            handleSubmit={handleSubmit}
            onChangeHandler={onChangeHandler}
            handleImageChange={handleImageChange}
            uploadProgress={uploadProgress}
            formLoading={formLoading}
            handleClickAddNew={handleClickAddNew}
            createRestaurantSuccess={createRestaurantSuccess}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
};
