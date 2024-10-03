import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  FileInput,
  Label,
  Progress,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { RestaurantSidebar } from "../components/RestaurantSidebar";

export default function Restaurants() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [createRestaurantSuccess, setCreateRestaurantSuccess] = useState("");

  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`/api/restaurant/${currentUser._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
      user_id: currentUser._id,
    });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setCreateRestaurantSuccess(null);
    if (!formData.restaurantname || !formData.address || !formData.logo) {
      return setErrorMessage("Please fill out all fields");
    }

    try {
      setErrorMessage(null);
      const res = await fetch("/api/restaurant/createRestaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/restaurants");
        setCreateRestaurantSuccess("Restaurant Created Successfully !! ");
      }
    } catch (error) {
      return setErrorMessage(error.message);
    }
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
          setFormData((prev) => ({ ...prev, logo: downloadURL }));
        });
      }
    );
  };

  return (
    <div className="min-h-screen mt-20">
      {restaurants.length ? (
        <RestaurantSidebar restaurant={restaurants[0]} />
      ) : (
        <>
          <div className="flex mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                MenuMania
              </span>
              <p className="text-sm mt-5">
                Take the next step and add your first restaurant today.
              </p>
            </div>
            <div className="flex-1">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <Label value="Restaurant Name" />
                  <TextInput
                    type="text"
                    placeholder="Restaurant name"
                    id="restaurantname"
                    onChange={onChangeHandler}
                  />
                </div>
                <div>
                  <Label value="Restaurant Address" />
                  <TextInput
                    type="text"
                    placeholder="12 Ave, Infocity Square"
                    id="address"
                    onChange={onChangeHandler}
                  />
                </div>
                <div>
                  <FileInput
                    id="logo"
                    accept="image/*"
                    helperText="Upload Logo"
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
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                >
                  Submit
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
          </div>
        </>
      )}
    </div>
  );
}
