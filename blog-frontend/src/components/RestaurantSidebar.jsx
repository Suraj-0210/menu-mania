import { Button, Modal, Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoRestaurant } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // Importing QR Code component
import { useRef } from "react";

export const RestaurantSidebar = (props) => {
  const currentRestaurant = props.restaurant;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentRestaurant.restaurantname}-qrcode.png`;
    a.click();
  };

  const handleDeleteRestaurant = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/restaurant/delete/${currentRestaurant._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar className="w-full md:w-50">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Logo>
              <img
                src={currentRestaurant.logo}
                alt="Sample"
                className="w-20 h-20"
              />
            </Sidebar.Logo>
            <Sidebar.Item>Id {currentRestaurant._id}</Sidebar.Item>
            <Sidebar.Item icon={IoRestaurant}>
              {currentRestaurant.restaurantname}
            </Sidebar.Item>
            <span>
              <Sidebar.Item icon={FaHome}>
                {currentRestaurant.address}
              </Sidebar.Item>
            </span>
            <div className="mt-4 ml-7" ref={qrCodeRef}>
              <QRCodeCanvas
                value={`https://menumania-end-user.netlify.app/`} // The URL you want to encode
                size={128} // Adjust size as needed
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                includeMargin={true}
              />
              {/* Clickable QR Code to download */}
              <span
                className="text-blue-500 cursor-pointer mt-2"
                onClick={downloadQRCode}
              >
                Download QR Code
              </span>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <div className="text-red-500 flex justify-between mt-20 ">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Restaurant
          </span>
          <span className="cursor-pointer">Update</span>
        </div>
      </Sidebar>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteRestaurant}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
