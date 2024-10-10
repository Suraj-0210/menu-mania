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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="mb-5 text-lg text-gray-700 dark:text-gray-400">
        Take the next step, add your {menu.length ? "next" : "first"} dish!
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label value="Dish Name" />
          <TextInput
            type="text"
            placeholder="Pancakes"
            id="name"
            onChange={onChangeHandler}
            className="rounded-md"
          />
        </div>
        <div>
          <Label value="Description" />
          <TextInput
            type="text"
            placeholder="Brief description of the dish"
            id="description"
            onChange={onChangeHandler}
            className="rounded-md"
          />
        </div>
        <div>
          <Label value="Price" />
          <TextInput
            type="text"
            placeholder="₹ 80"
            id="price"
            onChange={onChangeHandler}
            className="rounded-md"
          />
        </div>
        <div>
          <FileInput
            id="image"
            accept="image/*"
            helperText="Upload an image"
            onChange={handleImageChange}
          />
        </div>
        {uploadProgress > 0 && (
          <Progress
            progress={uploadProgress}
            color="purple"
            label={`${uploadProgress}%`}
            className="mt-2 rounded-full"
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
          <Button onClick={handleClickAddNew}>Cancle</Button>
        ) : (
          ""
        )}
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
  );
};
