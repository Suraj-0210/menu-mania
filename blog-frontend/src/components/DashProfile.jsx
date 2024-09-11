import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailed,
} from "../redux/User/userSlice";

import { useDispatch } from "react-redux";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);

  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);

  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);

  const filePickerRef = useRef();

  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(null);

  const [updateError, setUpdateError] = useState(null);

  console.log(imageFileUploadingProgress, imageFileUploadingError);

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (imageFile) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
    setImageFileUploading(true);

    // Check if the file size exceeds 2MB
    if (imageFile.size > maxFileSize) {
      setImageFileUploadingError(
        "File size exceeds 2MB. Please upload a smaller file."
      );
      setImageFileUploading(false);
      setImageFileUrl(null);
      setImageFile(null);
      setImageFileUploadingProgress(null);
      return; // Exit the function without uploading
    }
    setImageFileUploadingError(null);
    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError(
          "Couldn't upload image (File must be less than 2 MB)"
        );
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploadingProgress(null);
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setUpdateError(null);
      setUpdateSuccess(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setUpdateError(null);
    setUpdateSuccess(null);
  };
  console.log(formData, currentUser._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length == 0) {
      setUpdateError("No changes were made.");
      return;
    }

    if (imageFileUploading) {
      setUpdateError("Please wait for the image to Upload");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setUpdateError(data.message);
        return dispatch(updateFailed(data.message));
      } else {
        setUpdateSuccess("Updated Successfully");
        return dispatch(updateSuccess(data));
      }
    } catch (error) {
      dispatch(updateFailed(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32, h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-32 h-32 object-cover border-8 border-r-8 border-[light-gray]"
          />
        </div>
        {imageFileUploadingError && (
          <Alert color={"failure"}>{imageFileUploadingError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type=""
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>

      {updateSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert color={"failure"} className="mt-5">
          {updateError}
        </Alert>
      )}
    </div>
  );
}

export default DashProfile;
