import React from 'react';
import { Star, Plus } from 'lucide-react';

const ItemCard = ({ item, onAddToCart }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-100 to-orange-50 px-2 py-1 rounded-full border border-orange-200">
                    <Star className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1 inline" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{item.score}</span>
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed">{item.description}</p>

                <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">
                        ${item.price.toLocaleString()}
                    </div>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;