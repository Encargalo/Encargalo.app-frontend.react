import React from 'react';
import { ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';

const TopCombosCarousel = ({ items, shops, carouselRef, onScrollCarousel, onSelectShop, onAddToCart }) => {
    return (
        <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Top 10 Combos</h2>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Los combos más populares y mejor valorados</p>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                    <button
                        onClick={() => onScrollCarousel('left')}
                        className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 hover:text-orange-600" />
                    </button>
                    <button
                        onClick={() => onScrollCarousel('right')}
                        className="bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-full p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 hover:text-orange-600" />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-3 sm:pb-4"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitScrollbar: { display: 'none' }
                    }}
                >
                    {items
                        .filter(item => item.is_available)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 10)
                        .map((item, index) => {
                            const shop = shops.find(s => s.id === item.shop_id);
                            return (
                                <div
                                    key={item.id}
                                    className="flex-shrink-0 w-64 sm:w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
                                    onClick={() => {
                                        onSelectShop(shop);
                                        setTimeout(() => onAddToCart(item), 100);
                                    }}
                                >
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                                            #{index + 1} Top
                                        </div>
                                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-md">
                                            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-orange-500 fill-current mr-1 inline" />
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">{item.score}</span>
                                        </div>
                                        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddToCart(item);
                                                }}
                                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 sm:p-2 shadow-lg transition-all duration-300 hover:scale-110"
                                            >
                                                <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-5">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-lg group-hover:text-orange-600 transition-colors mb-1 sm:mb-2">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-lg sm:text-2xl font-bold text-orange-600">
                                                ${item.price.toLocaleString()}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-1">Disponible en:</p>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-700">{shop?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default TopCombosCarousel;