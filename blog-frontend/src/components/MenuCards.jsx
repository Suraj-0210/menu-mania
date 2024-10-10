import { Card } from "flowbite-react";
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const MenuCards = (props) => {
  const { menu, isAddNew, handleClickAddNew } = props;
  const navigate = useNavigate();

  const deleteDish = async (e, dishname) => {
    try {
      const res = await fetch(`/api/menu/delete/${dishname}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      await res.json();
      if (res.ok) {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dish, index) => (
          <Card
            key={index}
            className="max-w-[300px] max-h-[400px] shadow-lg transition-transform transform hover:scale-105 rounded-lg overflow-hidden"
          >
            <div className="h-48 w-full overflow-hidden rounded-t-lg">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h5 className="text-xl font-semibold text-gray-800">
                {dish.name}
              </h5>
              <p className="text-gray-600 mt-2">{dish.description}</p>
              <p className="text-lg font-bold mt-2 text-indigo-600">
                ₹{dish.price}
              </p>
            </div>
            <div
              className="text-red-500 flex justify-end cursor-pointer p-2"
              onClick={(e) => deleteDish(e, dish.name)}
            >
              <span>Delete</span>
            </div>
          </Card>
        ))}

        {/* Add another dish button */}
        <Card
          className="max-w-xs cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105 bg-gradient-to-r from-blue-200 to-blue-400 text-white"
          onClick={handleClickAddNew} // Use the prop here
        >
          <div className="p-4 flex flex-col items-center">
            <h5 className="text-xl font-semibold mb-4">Add Another Dish</h5>
            <IoAddCircleSharp className="text-4xl" />
          </div>
        </Card>
      </div>
    </>
  );
};
