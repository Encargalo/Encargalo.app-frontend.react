import { Phone, Lock, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

const LoginModal = ({ show, onClose, onLogin, isLoading }) => {
  const [loginData, setLoginData] = useState({ phone: "+57 ", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handlePhoneChange = (e) => {
    const prefix = "+57 ";
    const { value } = e.target;

    if (!value.startsWith(prefix)) {
      // Si el usuario intenta borrar el prefijo, lo restauramos.
      setLoginData({ ...loginData, phone: prefix });
    } else {
      // Permitimos cambios solo después del prefijo y nos aseguramos de que sean solo números.
      const numericPart = value.slice(prefix.length).replace(/[^0-9]/g, "");
      setLoginData({ ...loginData, phone: `${prefix}${numericPart}` });
    }
  };

  /* onsubmit */
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginData);
  };

  /* show modal */
  if (!show) return null;

  return (
    <dialog className="fixed inset-0 bg-transparent w-full h-full backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <section className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header del modal */}
        <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-7 ">
          <figure className="flex items-center justify-between">
            {/* title header */}
            <h2 className="text-3xl font-bold text-white">Iniciar Sesión</h2>

            {/* close button */}
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 p-2 rounded-full w-max h-max bg-orange-400 text-2xl font-bold"
            >
              {/* icon close */}
              <X />
            </button>
          </figure>

          {/* subtitle header */}
          <p className="text-orange-100 mt-1 text-x">
            Ingresa tu número y contraseña
          </p>
        </header>

        {/* Formulario */}
        <form className="px-6 pt-6">
          {/* Campos */}
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
                  onChange={handlePhoneChange}
                  placeholder="+57 "
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
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* footer */}
        {/* Enlaces adicionales */}
        <footer className="mt-4 text-center pb-6">
          <p className="text-x">
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p className="text-x text-gray-600 mt-1">
            ¿No tienes cuenta?
            <button className="text-orange-500 ml-2.5  hover:text-orange-600 font-medium">
              Regístrate aquí
            </button>
          </p>
        </footer>
      </section>
    </dialog>
  );
};

export default LoginModal;
