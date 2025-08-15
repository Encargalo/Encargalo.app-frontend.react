import React, { useState, useMemo, useRef } from 'react';
import { ShoppingCart, User, Star, Clock } from 'lucide-react';

// Importar componentes
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import SearchAndFilters from './components/SearchAndFilters';
import ShopCard from './components/ShopCard';
import ItemCard from './components/ItemCard';
import TopCombosCarousel from './components/TopCombosCarousel';

// Datos mock
const ITEMS_DATA = [
    {
        id: '1',
        shop_id: '1',
        category_id: 'cat1',
        name: 'Combo Pizza Familiar',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
        description: 'Pizza grande + bebida 1.5L + porción de papas fritas',
        is_available: true,
        score: 4.7
    },
    {
        id: '2',
        shop_id: '2',
        category_id: 'cat2',
        name: 'Mega Burger Combo',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
        description: 'Doble burger + papas grandes + bebida + helado',
        is_available: true,
        score: 4.5
    },
    {
        id: '3',
        shop_id: '3',
        category_id: 'cat3',
        name: 'Sushi Premium Box',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
        description: '30 piezas variadas + sopa miso + postre japonés',
        is_available: true,
        score: 4.9
    },
    {
        id: '4',
        shop_id: '4',
        category_id: 'cat4',
        name: 'Fiesta Mexicana',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400&h=400&fit=crop',
        description: '3 tacos + nachos + guacamole + bebida + flan',
        is_available: false,
        score: 4.2
    },
    {
        id: '5',
        shop_id: '5',
        category_id: 'cat5',
        name: 'Pasta Italiana Duo',
        price: 1900,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop',
        description: 'Pasta para 2 + pan de ajo + ensalada + vino',
        is_available: true,
        score: 4.6
    },
    {
        id: '6',
        shop_id: '6',
        category_id: 'cat6',
        name: 'Desayuno Completo',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=400&fit=crop',
        description: 'Café + medialunas + jugo + tostadas + mermelada',
        is_available: true,
        score: 4.4
    }
];

const SHOPS_DATA = [
    {
        id: '1',
        name: 'Pizza Palace',
        tag: 'pizza italiana',
        address: 'Av. Corrientes 1234, Buenos Aires',
        home_phone: '+54 11 1234-5678',
        latitude: -34.603722,
        longitude: -58.381592,
        logo_image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
        opened: true,
        type: 'restaurant',
        score: 4.5,
        license_status: 'active',
        deliveryTime: '25-35 min',
        minOrder: '$800',
        deliveryFee: 'Gratis'
    },
    {
        id: '2',
        name: 'Burger Master',
        tag: 'hamburguesas gourmet',
        address: 'Palermo Soho, Buenos Aires',
        home_phone: '+54 11 2345-6789',
        latitude: -34.588722,
        longitude: -58.421592,
        logo_image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
        opened: true,
        type: 'restaurant',
        score: 4.2,
        license_status: 'active',
        deliveryTime: '30-40 min',
        minOrder: '$1200',
        deliveryFee: '$200'
    },
    {
        id: '3',
        name: 'Sushi Zen',
        tag: 'comida japonesa',
        address: 'Recoleta, Buenos Aires',
        home_phone: '+54 11 3456-7890',
        latitude: -34.593722,
        longitude: -58.391592,
        logo_image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
        opened: true,
        type: 'restaurant',
        score: 4.8,
        license_status: 'active',
        deliveryTime: '35-45 min',
        minOrder: '$1500',
        deliveryFee: 'Gratis'
    },
    {
        id: '4',
        name: 'Taco Fiesta',
        tag: 'comida mexicana',
        address: 'San Telmo, Buenos Aires',
        home_phone: '+54 11 4567-8901',
        latitude: -34.613722,
        longitude: -58.371592,
        logo_image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
        opened: false,
        type: 'restaurant',
        score: 4.0,
        license_status: 'active',
        deliveryTime: '40-50 min',
        minOrder: '$900',
        deliveryFee: '$150'
    },
    {
        id: '5',
        name: 'Pasta Roma',
        tag: 'pasta italiana',
        address: 'Puerto Madero, Buenos Aires',
        home_phone: '+54 11 5678-9012',
        latitude: -34.610722,
        longitude: -58.361592,
        logo_image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop',
        opened: true,
        type: 'restaurant',
        score: 4.6,
        license_status: 'active',
        deliveryTime: '20-30 min',
        minOrder: '$1000',
        deliveryFee: 'Gratis'
    },
    {
        id: '6',
        name: 'Café Central',
        tag: 'café y desayunos',
        address: 'Microcentro, Buenos Aires',
        home_phone: '+54 11 6789-0123',
        latitude: -34.603722,
        longitude: -58.381592,
        logo_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop',
        opened: true,
        type: 'restaurant',
        score: 4.3,
        license_status: 'active',
        deliveryTime: '15-25 min',
        minOrder: '$600',
        deliveryFee: '$100'
    }
];

const EncargaloApp = () => {
    // Estados de autenticación
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Estados de la aplicación
    const [items] = useState(ITEMS_DATA);
    const [shops] = useState(SHOPS_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('score');
    const [favorites, setFavorites] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [cart, setCart] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const carouselRef = useRef(null);

    // Función de login simulada
    const handleLogin = async (loginData) => {
        setIsLoggingIn(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Validación básica
            const phoneValid = loginData.phone.trim().length > 0;
            const passwordValid = loginData.password ? loginData.password.length >= 4 : true;

            if (phoneValid && passwordValid) {
                setUser({
                    id: '1',
                    name: 'Usuario Demo',
                    phone: loginData.phone
                });
                setIsLoggedIn(true);
                setShowLogin(false);
            } else {
                alert('Por favor verifica que el teléfono no esté vacío y la contraseña tenga al menos 4 caracteres');
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error al iniciar sesión. Inténtalo de nuevo.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setCart([]);
    };

    // Obtener items del shop seleccionado
    const shopItems = useMemo(() => {
        if (!selectedShop) return [];
        return items.filter(item => item.shop_id === selectedShop.id && item.is_available);
    }, [items, selectedShop]);

    // Agregar item al carrito
    const addToCart = (item) => {
        setCart(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    // Calcular total del carrito
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Funciones del carrusel
    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 280; // Ancho de tarjeta mobile + gap
            const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            carouselRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Filtrar y ordenar restaurantes
    const filteredShops = useMemo(() => {
        let filtered = shops.filter(shop => {
            const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shop.tag.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = selectedFilter === 'all' ||
                (selectedFilter === 'open' && shop.opened) ||
                (selectedFilter === 'favorites' && favorites.has(shop.id));

            return matchesSearch && matchesFilter && shop.license_status === 'active';
        });

        // Ordenar
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.score - a.score;
                case 'deliveryTime':
                    return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [shops, searchTerm, selectedFilter, sortBy, favorites]);

    const toggleFavorite = (shopId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(shopId)) {
                newFavorites.delete(shopId);
            } else {
                newFavorites.add(shopId);
            }
            return newFavorites;
        });
    };

    // Vista del menú del restaurante
    if (selectedShop) {
        return (
            <div className="min-h-screen bg-white from-white to-orange-50/30 via-orange-100/50">
                {/* Header del restaurante */}
                <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <button
                                    onClick={() => setSelectedShop(null)}
                                    className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
                                >
                                    ← Volver
                                </button>
                                <div>
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{selectedShop.name}</h1>
                                    <p className="text-sm sm:text-base text-gray-600 capitalize">{selectedShop.tag}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {cart.length > 0 && (
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl shadow-lg">
                                        <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-1 sm:mr-2" />
                                        <span className="font-bold text-sm sm:text-base">${cartTotal.toLocaleString()}</span>
                                    </div>
                                )}

                                {/* Usuario en vista de restaurante */}
                                {isLoggedIn && (
                                    <div className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-orange-200">
                                        <User className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">{user.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Imagen del restaurante */}
                <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                    <img
                        src={selectedShop.logo_image}
                        alt={selectedShop.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-1 sm:mb-2">
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                                <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-bold text-sm sm:text-base">{selectedShop.score}</span>
                            </div>
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                                <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                                <span className="text-sm sm:text-base">{selectedShop.deliveryTime}</span>
                            </div>
                        </div>
                        <p className="text-orange-200 text-sm sm:text-base">{selectedShop.address}</p>
                    </div>
                </div>

                {/* Combos disponibles */}
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Combos Disponibles</h2>

                    {shopItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {shopItems.map(item => (
                                <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-16">
                            <div className="text-gray-400 text-4xl sm:text-6xl mb-4 sm:mb-6">🍽️</div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2">No hay combos disponibles</h3>
                            <p className="text-gray-500 text-sm sm:text-base">Este restaurante no tiene combos disponibles en este momento</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-200  to-orange-400">
            {/* Header */}
            <Header
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={() => setShowLogin(true)}
                onLogout={handleLogout}
            />

            {/* Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Search and Filters */}
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

                {/* Top 10 Combos Carousel */}
                {!searchTerm && (
                    <TopCombosCarousel
                        items={items}
                        shops={shops}
                        carouselRef={carouselRef}
                        onScrollCarousel={scrollCarousel}
                        onSelectShop={setSelectedShop}
                        onAddToCart={addToCart}
                    />
                )}

                {/* Results Summary */}
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Restaurantes disponibles'}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                        {filteredShops.length} {filteredShops.length === 1 ? 'restaurante encontrado' : 'restaurantes encontrados'}
                    </p>
                </div>

                {/* Restaurants Grid */}
                {filteredShops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {filteredShops.map(shop => (
                            <ShopCard
                                key={shop.id}
                                shop={shop}
                                favorites={favorites}
                                onToggleFavorite={toggleFavorite}
                                onSelectShop={setSelectedShop}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <div className="text-gray-400 text-6xl sm:text-8xl mb-4 sm:mb-6">🍽️</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No se encontraron restaurantes</h3>
                        <p className="text-gray-500 text-sm sm:text-base lg:text-lg">Intenta cambiar los filtros o el término de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Modal de Login */}
            <LoginModal
                show={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
                isLoading={isLoggingIn}
            />
        </div>
    );
};

export default EncargaloApp;