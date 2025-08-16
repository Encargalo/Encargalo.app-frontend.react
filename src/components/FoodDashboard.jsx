import { useState, useMemo, useRef } from "react";
import SearchAndFilters from "./SearchAndFilters";
import ShopCard from "./ShopCard";
import TopCombosCarousel from "./TopCombosCarousel";

const FoodDashboard = ({ shops, favorites, toggleFavorite, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [showFilters, setShowFilters] = useState(true);
  const carouselRef = useRef(null);

  // Filtrar y ordenar restaurantes
  const filteredShops = useMemo(() => {
    let filtered = shops.filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "open" && shop.opened) ||
        (selectedFilter === "favorites" && favorites.has(shop.id));
      return matchesSearch && matchesFilter && shop.license_status === "active";
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "deliveryTime":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return filtered;
  }, [shops, searchTerm, selectedFilter, sortBy, favorites]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
      {!searchTerm && (
        <TopCombosCarousel carouselRef={carouselRef} onAddToCart={addToCart} />
      )}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : "Restaurantes disponibles"}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          {filteredShops.length}{" "}
          {filteredShops.length === 1
            ? "restaurante encontrado"
            : "restaurantes encontrados"}
        </p>
      </div>
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="text-gray-400 text-6xl sm:text-8xl mb-4 sm:mb-6">
            🍽️
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            No se encontraron restaurantes
          </h3>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Intenta cambiar los filtros o el término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodDashboard;
