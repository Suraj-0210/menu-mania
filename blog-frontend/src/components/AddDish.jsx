import {
  Alert,
  Button,
  FileInput,
  Label,
  Progress,
  Spinner,
  TextInput,
} from "flowbite-react";

export const AddDish = ({
  menu,
  handleSubmit,
  handleClickAddNew,
  onChangeHandler,
  handleImageChange,
  uploadProgress,
  formLoading,
  createRestaurantSuccess,
  errorMessage,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="mb-5 text-lg text-gray-700 dark:text-gray-300">
        Take the next step, add your {menu.length ? "next" : "first"} dish!
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label
            className="text-gray-700 dark:text-gray-300"
            value="Dish Name"
          />
          <TextInput
            type="text"
            placeholder="Pancakes"
            id="name"
            onChange={onChangeHandler}
            className="rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <Label
            className="text-gray-700 dark:text-gray-300"
            value="Description"
          />
          <TextInput
            type="text"
            placeholder="Brief description of the dish"
            id="description"
            onChange={onChangeHandler}
            className="rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <Label className="text-gray-700 dark:text-gray-300" value="Price" />
          <TextInput
            type="text"
            placeholder="₹ 80"
            id="price"
            onChange={onChangeHandler}
            className="rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <FileInput
            id="image"
            accept="image/*"
            helperText="Upload an image"
            onChange={handleImageChange}
            className="dark:text-gray-200"
          />
        </div>
        {uploadProgress > 0 && (
          <Progress
            progress={uploadProgress}
            color="purple"
            label={`${uploadProgress}%`}
            className="mt-2 rounded-full dark:bg-gray-600 dark:text-gray-100"
          />
        )}
        <Button
          gradientDuoTone="purpleToPink"
          type="submit"
          disabled={formLoading}
        >
          {formLoading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Submitting...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>

        {menu?.length ? (
          <Button
            onClick={handleClickAddNew}
            color="gray"
            className="dark:bg-gray-700"
          >
            Cancel
          </Button>
        ) : (
          ""
        )}
      </form>

      {createRestaurantSuccess && (
        <Alert
          color="success"
          className="mt-5 dark:bg-green-600 dark:text-gray-100"
        >
          {createRestaurantSuccess}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          className="mt-5 dark:bg-red-600 dark:text-gray-100"
          color="failure"
        >
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};
