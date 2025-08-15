import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const SearchAndFilters = ({
                              searchTerm,
                              onSearchChange,
                              selectedFilter,
                              onFilterChange,
                              sortBy,
                              onSortChange,
                              showFilters,
                              onToggleFilters
                          }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100">
            <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 sm:w-6 h-5 sm:h-6" />
                <input
                    type="text"
                    placeholder="Busca restaurantes o comida..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base sm:text-lg"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <button
                    onClick={onToggleFilters}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-orange-100 hover:to-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 border border-gray-200 w-full sm:w-auto"
                >
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
                    <span className="font-semibold text-gray-700">Filtros</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <select
                            value={selectedFilter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
                        >
                            <option value="all">Todos</option>
                            <option value="open">Abiertos</option>
                            <option value="favorites">Favoritos</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
                        >
                            <option value="score">Mejor calificado</option>
                            <option value="deliveryTime">Tiempo de entrega</option>
                            <option value="name">Nombre A-Z</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchAndFilters;