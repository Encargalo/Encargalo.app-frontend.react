import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ show, onClose, onLogin, isLoading }) => {
    const [loginData, setLoginData] = useState({ phone: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(loginData);
    };

    const handleQuickLogin = () => {
        const quickData = { phone: '+54 9 11 1234-5678', password: '1234' };
        setLoginData(quickData);
        setTimeout(() => onLogin(quickData), 100);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-orange-200 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-orange-100 mt-1 text-sm">Ingresa tu número y contraseña</p>
                </div>

                {/* Formulario */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Campo teléfono */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Número de teléfono
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-4 h-4" />
                                <input
                                    type="tel"
                                    value={loginData.phone}
                                    onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                                    placeholder="+54 9 11 1234-5678"
                                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo contraseña */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-4 h-4" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                    minLength={4}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón de login */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition-all duration-300 mt-6 shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Iniciando sesión...</span>
                            </div>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                    {/* Enlaces adicionales */}
                    <div className="mt-4 text-center space-y-2">
                        {/* Botón de login rápido para pruebas */}
                        <button
                            type="button"
                            onClick={handleQuickLogin}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition-all duration-300 mb-3"
                        >
                            🚀 Login Rápido (Demo)
                        </button>

                        <p className="text-xs text-gray-600">
                            <button className="text-orange-500 hover:text-orange-600 font-medium">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </p>
                        <p className="text-xs text-gray-600">
                            ¿No tienes cuenta?
                            <button className="text-orange-500 hover:text-orange-600 font-medium ml-1">
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;