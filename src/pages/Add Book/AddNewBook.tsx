import AddBookForm from './AddbookForm';

const AddNewBook = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      {/* Heading and description */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-Soil-800 mb-2">
          Add a New Book
        </h1>
        <p className="text-gray-600 text-lg ">
          Fill out the details below to add a new book to your listings. Make
          sure to include accurate information to attract buyers.
        </p>
      </div>
      <div>
        <AddBookForm />
      </div>
    </div>
  );
};

export default AddNewBook;
