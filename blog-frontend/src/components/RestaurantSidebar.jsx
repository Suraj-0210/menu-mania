import { Button, Label, Modal, Select, Sidebar } from "flowbite-react";
import { IoRestaurant } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // Importing QR Code component

export const RestaurantSidebar = (props) => {
  const currentRestaurant = { ...props.restaurant };
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);
  const [selectedTable, setSelectedTable] = useState(1); // State for table selection

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentRestaurant.restaurantname}-table-${selectedTable}-qrcode.png`;
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
      await fetch(`/api/menu/deleteAll/${currentRestaurant._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Restaurant Deleted");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar
        className="w-full md:w-50 bg-white shadow-lg rounded-lg border border-gray-200 p-1"
        aria-label="Restaurant Sidebar"
        style={{
          zIndex: 10, // Higher z-index to make it prominent
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Custom shadow for elevation effect
        }}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="mx-auto text-center">
              <Sidebar.Logo>
                <img
                  src={currentRestaurant.logo}
                  alt="Sample"
                  className="w-20 h-20 rounded-full border border-gray-300 shadow-md"
                />
              </Sidebar.Logo>
              <Sidebar.Item className="mt-4">
                ID: {currentRestaurant._id}
              </Sidebar.Item>
              <Sidebar.Item icon={IoRestaurant} className="text-lg font-bold">
                {currentRestaurant.restaurantname}
              </Sidebar.Item>

              <Sidebar.Item icon={FaHome} className="text-sm">
                <span>{currentRestaurant.address}</span>
              </Sidebar.Item>
            </div>

            {/* Dropdown for selecting the table number */}
            <div className="mt-6 mx-auto">
              <Label value="Select Table" className="text-gray-600" />
              <Select
                id="tableSelect"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full mt-2 rounded-lg border-gray-300 shadow-sm"
              >
                {[...Array(currentRestaurant.tables).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    Table {i + 1}
                  </option>
                ))}
              </Select>
            </div>

            {/* QR Code Section */}
            <div className="mt-4 ml-7" ref={qrCodeRef}>
              <QRCodeCanvas
                value={`https://menumania-end-user.netlify.app/${currentRestaurant._id}?table=${selectedTable}`} // The URL you want to encode
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

        <div className="text-red-500 flex justify-between mt-10 border-t pt-4">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setShowModal(true)}
          >
            Delete Restaurant
          </span>
          <span className="cursor-pointer hover:underline">Update</span>
        </div>
      </Sidebar>

      {/* Modal for Delete Confirmation */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
        style={{
          zIndex: 20,
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your restaurant?
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
