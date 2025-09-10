//lucide-react
import { ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
//react
import { useEffect, useRef, useState } from "react";
//services
import getCombosCarrusel from "../services/getCombosCarrusel";
//components
import FoodDetailsModal from "./FoodDetailsModal";

const TopCombosCarousel = () => {
  const [items, setItems] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const carouselRef = useRef(null);


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
        <header className="flex flex-col sm:items-center justify-between mb-4 sm:mb-6">
          <figure className="w-full flex justify-between items-center mb-2">
            {/* title header */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              ¡Los mejores combos!
            </h2>
            <div className="flex space-x-1 sm:space-x-2 items-start h-full">
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
          </figure>

          {/* subtitle header */}
          <p className="text-orange-950 text-lg sm:text-base lg:text-lg w-full">
            Los combos más populares y mejor valorados
          </p>

          {/* scroll carousel */}
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
            {items?.map((item, index) => {
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
                      className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300 aspect-3/2 "
                    />

                    {/* top carrusel */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      #{index + 1} Top
                    </div>

                    {/* score carrusel */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-md flex items-center">
                      <Star className="w-4 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1 inline" />
                      <span className="text-xm sm:text-sm font-bold">
                        {item.score}
                      </span>
                    </div>

                    {/* open modal */}
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 sm:p-2 shadow-lg transition-all duration-300 hover:scale-110">
                        <Plus className="size-7 sm:size-6" />
                      </button>
                    </div>
                  </header>

                  {/* footer carrusel */}
                  <figure className="p-3 sm:p-5">
                    {/* name item */}
                    <h4 className="font-bold text-xl sm:text-2xl group-hover:text-orange-600 transition-colors mb-1 sm:mb-2">
                      {item.name}
                    </h4>
                    {/* description item */}
                    <p className="text-xm sm:text-xl text-gray-600 mb-2 sm:mb-3 leading-relaxed truncate">
                      {item.description}
                    </p>

                    {/* price item */}
                    <footer className="flex items-end justify-between">
                      {/* price item */}
                      <div className="text-lg sm:text-2xl font-bold text-orange-600">
                        ${item.price.toLocaleString()}
                      </div>

                      {/* shop info */}
                      <div className="text-right">
                        <p className="text-xm sm:text-xl text-gray-500">
                          Disponible en:
                        </p>
                        <p className="text-xm sm:text-xl font-semibold text-gray-700">
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
