import { Link } from "react-router-dom";

const sellers = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Top Rated Seller",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Michael Smith",
    title: "Best Seller of the Month",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Sophia Lee",
    title: "Trusted Seller",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export function TopSellersSection() {
  return (
    <section className="max-w-7xl mx-auto my-16 px-4 transition-colors duration-300 
      bg-bg-light dark:bg-bg-dark"
    >
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold mb-8 flex items-center gap-3 text-gray-800  transition-colors">
         Top Sellers
      </h2>

      {/* Seller Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center border border-gray-200 dark:bg-gray-600 bg-white dark:text-white "
          >
            {/* Seller Avatar */}
            <div className="h-28 w-28 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4 shadow-md overflow-hidden">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="h-full w-full object-cover rounded-full"
              />
            </div>

            {/* Seller Name */}
            <h3 className="text-2xl font-bold mb-1">{seller.name}</h3>

            {/* Seller Info */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">{seller.title}</p>

            {/* View Profile Button */}
            <Link
              to={`/seller/${seller.id}`}
              className="inline-block px-4 py-2 bg-gray-500 dark:bg-gray-100 dark:text-black dark:border-gray-300 dark:border-1 text-white font-bold rounded-full shadow-lg hover:bg-gray-600 transition"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopSellersSection;
