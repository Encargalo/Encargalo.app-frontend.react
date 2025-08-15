import React from 'react';
import { MapPin, User, LogOut } from 'lucide-react';

const Header = ({ isLoggedIn, user, onLogin, onLogout }) => {
    return (
        <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        EncargaloApp
                    </h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">Buenos Aires, Argentina</span>

                        {/* Botones de autenticación */}
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-2 sm:px-4 py-1 sm:py-2 rounded-xl border border-orange-200">
                                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">{user?.name}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-orange-600 px-2 sm:px-3 py-1 sm:py-2 rounded-xl hover:bg-orange-50 transition-all duration-300"
                                >
                                    <LogOut className="w-3 sm:w-4 h-3 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">Salir</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                            >
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;