import { Search, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
}) => {
  const [filterChevron, setFilterChevron] = useState(false);

  return (
    <aside className="rounded-2xl shadow-xl mb-6 sm:mb-7">
      {/* input search */}
      <search className="relative">
        <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 sm:w-6 h-5 sm:h-6 " />
        <input
          type="text"
          placeholder="Busca restaurantes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 text-base sm:text-lg"
        />
      </search>

      <section className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        {/* filter button */}
        {/* <button
          onClick={onToggleFilters}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-orange-100 hover:to-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 border border-gray-200 w-full sm:w-auto sm:hidden"
        >
          <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
          <span className="font-semibold text-gray-700">Filtros</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
              }`}
          />
        </button> */}

        {/* filters options */}
        {/* {showFilters && ( */}
        {/*  <div>
            <h4 className="font-semibold text-gray-700 hidden sm:text-xl sm:block mb-2">
              Busca por filtros:
            </h4>

            <div className="flex gap-3 items-center w-full sm:w-auto">
              <div
                className="relative w-full sm:w-auto"
                onClick={() => setFilterChevron(!filterChevron)}
              >
                <select
                  value={selectedFilter}
                  onChange={(e) => {
                    onFilterChange(e.target.value);
                  }}
                  className="sm:w-auto bg-transparent border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium px-4 py-2 cursor-pointer text-center sm:text-lg"
                >
                  <option value="all">Todos</option>
                  <option value="open">Abiertos</option>
                </select>
              </div>

              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="sm:w-auto border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium px-4 py-2 text-center cursor-pointer sm:text-lg"
                >
                  <option value="score">Mejor calificado</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div> */}
        {/* )} */}
      </section>
    </aside>
  );
};

export default SearchAndFilters;
