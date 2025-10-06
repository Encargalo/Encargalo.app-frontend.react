//react
import { useState, useMemo, useEffect } from "react";
//components
import getShops from "../services/getShops";
import SearchAndFilters from "./SearchAndFilters";
import ShopCard from "./ShopCard";
import TopCombosCarousel from "./TopCombosCarousel";
const FoodDashboard = ({ favorites, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [showFilters, setShowFilters] = useState(true);
  const [shops, setShops] = useState([]);

  //loader

  //Get shops
  useEffect(() => {
    getShops(setShops);
  }, []);

  // Filtrar y ordenar restaurantes
  const filteredShops = useMemo(() => {
    let filtered = shops.filter((shop) => {
      // Búsqueda por nombre o tag
      const matchesSearch =
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.tag.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "open" && shop.opened) ||
        (selectedFilter === "favorites" && favorites.has(shop.id));

      // Puedes agregar más condiciones si lo necesitas
      return matchesSearch && matchesFilter;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [shops, searchTerm, selectedFilter, sortBy, favorites]);

  return (
    <section className='w-full $ px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      {/* Search and filters */}
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

      {/* Top combos carousel */}
      {/*  {!searchTerm && <TopCombosCarousel />} */}

      {/* Top mas vendidos */}

      {/* Restaurantes filtrados */}
      <aside className="mb-6 sm:mb-8">
        {/* title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : "Restaurantes disponibles"}
        </h2>
        {/* subtitle */}
        <p className="text-orange-950 text-lg sm:text-base lg:text-lg">
          Encuentra tu proxima comida favorita
        </p>
      </aside>

      {/* Restaurantes filtrados */}
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          {filteredShops.map((shop) => (
            /* Card restaurant*/
            <ShopCard
              key={shop.id}
              shop={shop}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* No se encontraron restaurantes */
        <div className="text-center py-12 sm:py-16">
          {/* Icono de comida */}
          <div className="text-gray-400 text-6xl sm:text-8xl mb-4 sm:mb-6">
            🍽️
          </div>
          {/* Mensaje de no se encontraron restaurantes */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            No se encontraron restaurantes
          </h3>
          {/* Descripción del mensaje */}
          <p className="text-orange-100 text-sm sm:text-base lg:text-lg">
            Intenta cambiar los filtros o el término de búsqueda
          </p>
        </div>
      )}
    </section>
  );
};

export default FoodDashboard;
