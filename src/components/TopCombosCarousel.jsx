//lucide-react
import { ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
//react
import { useEffect, useState } from "react";
//services
import getCombosCarrusel from "../services/getCombosCarrusel";
//components
import FoodDetailsModal from "./FoodDetailsModal";

const TopCombosCarousel = ({ carouselRef }) => {
  const [items, setItems] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleComboClick = (combo) => {
    setSelectedCombo(combo);
  };

  const handleCloseModal = () => {
    setSelectedCombo(null);
  };

  // Carrusel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        carouselRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  //Get combos carrusel
  useEffect(() => {
    getCombosCarrusel(setItems);
  }, []);

  return (
    <>
      <section className="mb-8 sm:mb-12">
        {/* header */}
        <header className="flex items-center justify-between mb-4 sm:mb-6">
          <figure>
            {/* title header */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              ¡Los mejores combos!
            </h2>
            {/* subtitle header */}
            <p className="text-orange-950 text-sm sm:text-base lg:text-lg">
              Los combos más populares y mejor valorados
            </p>
          </figure>

          {/* scroll carousel */}
          <div className="flex space-x-1 sm:space-x-2">
            {/* scroll left */}
            <button
              onClick={() => scrollCarousel("left")}
              className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {/* scroll left icon */}
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 hover:text-orange-600" />
            </button>
            {/* scroll right */}
            <button
              onClick={() => scrollCarousel("right")}
              className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {/* scroll right icon */}
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 hover:text-orange-600" />
            </button>
          </div>
        </header>

        {/* carousel */}
        <section className="relative">
          {/* container carousel */}
          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-3 sm:pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {items.map((item, index) => {
              return (
                /* carrusel items */
                <div
                  key={item.id}
                  onClick={() => handleComboClick(item)}
                  className="flex-shrink-0 w-64 sm:w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
                >
                  {/* header carrusel */}
                  <header className="relative">
                    {/* img carrusel */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* top carrusel */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      #{index + 1} Top
                    </div>

                    {/* score carrusel */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-md">
                      <Star className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1 inline" />
                      <span className="text-xs sm:text-sm font-bold">
                        {item.score}
                      </span>
                    </div>

                    {/* add to cart */}
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 sm:p-2 shadow-lg transition-all duration-300 hover:scale-110">
                        <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                      </button>
                    </div>
                  </header>

                  {/* footer carrusel */}
                  <figure className="p-3 sm:p-5">
                    {/* name item */}
                    <h4 className="font-bold text-sm sm:text-lg group-hover:text-orange-600 transition-colors mb-1 sm:mb-2">
                      {item.name}
                    </h4>
                    {/* description item */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* price item */}
                    <footer className="flex items-center justify-between">
                      {/* price item */}
                      <div className="text-lg sm:text-2xl font-bold text-orange-600">
                        ${item.price.toLocaleString()}
                      </div>

                      {/* shop info */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">
                          Disponible en:
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700">
                          {item.shop.name}
                        </p>
                      </div>
                    </footer>
                  </figure>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {/* combo detail modal */}

      {selectedCombo && (
        <FoodDetailsModal combo={selectedCombo} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default TopCombosCarousel;
