import { Button, Modal, Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoRestaurant } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const RestaurantSidebar = (props) => {
  const currentRestaurant = props.restaurant;
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const handleDeleteRestaurant = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(
        `/api/restaurant/delete/${currentRestaurant._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailed(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailed(error.message));
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
            <Sidebar.Item icon={IoRestaurant}>
              {currentRestaurant.restaurantname}
            </Sidebar.Item>
            <span>
              <Sidebar.Item icon={FaHome}>
                {currentRestaurant.address}
              </Sidebar.Item>
            </span>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Account
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
