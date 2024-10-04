import { useEffect, useState } from "react";
import { RestaurantSidebar } from "../components/RestaurantSidebar";
import {
  Alert,
  Button,
  Card,
  FileInput,
  Label,
  Progress,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { IoAddCircleSharp } from "react-icons/io5";

export const RestaurantMenus = (props) => {
  const restaurant = props.restaurant;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [createRestaurantSuccess, setCreateRestaurantSuccess] = useState("");
  const [isAddNew, setIsAddNew] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(`/api/menu/${restaurant._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
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

    console.log(formData);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image
    ) {
      return setErrorMessage("Please fill out all fields");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/menu/createRecepie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate(0);
        handleClickAddNew();
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleClickAddNew = () => {
    console.log("add New");
    setIsAddNew((prevState) => !prevState); // Toggle between true/false
    console.log("IsAddNew" + isAddNew);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Optional preview before upload
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
        setUploadProgress(progress); // Update progress
      },
      (error) => {
        console.error("Error uploading image:", error);
        setErrorMessage("Error uploading image");
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        // Get download URL after the upload completes
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Image uploaded successfully, URL:", downloadURL);
          setImageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, image: downloadURL }));
        });
      }
    );
  };

  console.log(formData);
  console.log(menu);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="h-full mb-10">
        <RestaurantSidebar restaurant={restaurant} />
      </div>
      <div className="flex-1 justify-center md:justify-end mx-4 my-4">
        {!isAddNew && menu.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((dish, index) => (
              <Card key={index} className="max-w-xs">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="rounded-t-lg"
                />
                <div className="p-4">
                  <h5 className="text-xl font-semibold">{dish.name}</h5>
                  <p className="text-gray-600 mt-2">{dish.description}</p>
                  <p className="text-lg font-bold mt-2">₹{dish.price}</p>
                </div>
              </Card>
            ))}
            <Card
              className="max-w-xs cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-blue-200"
              onClick={handleClickAddNew} // Triggers function when the card is clicked
            >
              <div className="p-4 flex flex-col items-center">
                <h5 className="text-xl font-semibold mb-4">Add Another Dish</h5>
                <IoAddCircleSharp className="text-4xl" />
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex-1">
            <h2 className="mb-5 text-lg text-black-500 dark:text-gray-400">
              Take The next Step add your First Dish !!
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Dish Name" />
                <TextInput
                  type="text"
                  placeholder="Pancakes"
                  id="name"
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <Label value="Description" />
                <TextInput
                  type="text"
                  placeholder="Pancakes brings a delightful breakfast experience to life with its irresistible variety of pancake flavors."
                  id="description"
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <Label value="Price" />
                <TextInput
                  type="text"
                  placeholder="₹ 80"
                  id="price"
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <FileInput
                  id="image"
                  accept="image/*"
                  helperText="Upload Pic"
                  onChange={handleImageChange}
                />
              </div>
              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <Progress
                  progress={uploadProgress}
                  color="purple"
                  label={`${uploadProgress}%`}
                  className="mt-2"
                />
              )}
              <Button
                gradientDuoTone={"purpleToPink"}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading..</span>
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </form>
            {createRestaurantSuccess && (
              <Alert color="success" className="mt-5">
                {createRestaurantSuccess}
              </Alert>
            )}
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
