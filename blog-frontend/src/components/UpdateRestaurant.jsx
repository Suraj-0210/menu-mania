import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  FileInput,
  Label,
  Progress,
  Select,
  TextInput,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const UpdateRestaurant = ({
  currentUser,
  restaurantId, // restaurantId to be passed as a prop
  setUpdateRestaurantSuccess,
  setErrorMessage,
  navigate,
  updateRestaurantSuccess,
  errorMessage,
}) => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch current restaurant data for update
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const res = await fetch(`/api/restaurant/${restaurantId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData(data); // Pre-fill form data with the restaurant details
        } else {
          setErrorMessage("Error fetching restaurant data");
        }
      } catch (error) {
        setErrorMessage("Error fetching restaurant data");
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  console.log(formData);

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
      user_id: currentUser._id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setUpdateRestaurantSuccess(null);
    if (!formData.restaurantname || !formData.address || !formData.logo) {
      return setErrorMessage("Please fill out all fields");
    }

    try {
      const res = await fetch(`/api/restaurant/update/${restaurantId}`, {
        method: "PUT", // Use PUT for update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        setUpdateRestaurantSuccess("Restaurant Updated Successfully!!");
        navigate(0); // Refresh the page
      }
    } catch (error) {
      setErrorMessage(error.message);
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
        setErrorMessage("Error uploading image");
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, logo: downloadURL }));
        });
      }
    );
  };

  return (
    <div className="flex-1">
      <h2 className="mb-5 text-lg text-gray-700 dark:text-gray-400">
        Update Restaurant
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label value="Restaurant Name" />
          <TextInput
            type="text"
            placeholder="Restaurant name"
            id="restaurantname"
            value={formData.restaurantname || ""}
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <Label value="Restaurant Address" />
          <TextInput
            type="text"
            placeholder="12 Ave, Infocity Square"
            id="address"
            value={formData.address || ""}
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
        {uploadProgress > 0 && (
          <Progress
            progress={uploadProgress}
            color="purple"
            label={`${uploadProgress}%`}
            className="mt-2"
          />
        )}
        <div>
          <Label value="Number of Tables" />
          <Select
            id="tables"
            value={formData.tables || ""}
            onChange={onChangeHandler}
          >
            <option value="">Select number of tables</option>
            {[...Array(50).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
        </div>
        <Button
          gradientDuoTone={"purpleToPink"}
          type="submit"
          disabled={uploadProgress > 0 && uploadProgress < 100}
        >
          Submit
        </Button>
      </form>
      {updateRestaurantSuccess && (
        <Alert color="success" className="mt-5">
          {updateRestaurantSuccess}
        </Alert>
      )}
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

export default UpdateRestaurant;
