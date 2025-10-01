//icons
import { Star, Plus } from "lucide-react";

// Tarjeta de artículo con imagen, nombre, descripción, precio y botón de agregar.
const ItemCard = ({ item, onItemClick }) => {

  return (
    <article
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-max"
      onClick={() => onItemClick(item)}
    >
      {/* header */}
      <header className="relative">
        {/* img */}
        <img
          src={item.image}
          alt={item.name}
          className="w-full aspect-video object-cover"
        />
        {/* score */}
        <div className="flex items-center absolute top-3 right-3 bg-gradient-to-r from-orange-100 to-orange-50 px-2 py-1 rounded-full border border-orange-200">
          {/* star icon */}
          <Star className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1 inline" />
          {/* score */}
          <span className="text-base font-bold text-gray-900">{item.score}</span>
        </div>
      </header>



      <div className="flex flex-col justify-between px-4 pb-6 mt-4 sm:mt-5 gap-4">
        {/* details */}
        <figure className="mb-4">
          {/* name */}
          <h3 className="text-2xl font-bold text-gray-900 truncate">
            {item.name}
          </h3>
          {/* description */}
          <p className="text-gray-600 text-xl sm:text-1xl leading-relaxed truncate">
            {item.description}
          </p>
        </figure>

        {/* footer */}
        <footer className="flex items-center justify-between">
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            ${item.price.toLocaleString()}
          </p>

          <button
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            aria-label={`Agregar ${item.name} al carrito`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-base">Agregar</span>
          </button>
        </footer>
      </div>
    </article>
  );
};

export default ItemCard;
