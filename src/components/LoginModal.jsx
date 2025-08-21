import { Phone, Lock, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import logInCustomers from "../services/logInCustomers";

const LoginModal = ({ show, onClose, onOpenWelcome }) => {
  const [isLoading, setIsLoading] = useState()
  const [showPassword, setShowPassword] = useState(false);

  //form data
  const { control, handleSubmit, register, formState: { errors }, setError } = useForm({
    defaultValues: {
      phone_number: "+57", password: ""
    }
  })

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      phone_number: data.phone_number.replace(/\s+/g, ""),
    };
    logInCustomers(formattedData, setIsLoading, setError, onClose, onOpenWelcome)
  }

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
        <form className="px-6 pt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Campos */}
          <div className="space-y-4">
            {/* Campo teléfono */}
            <div>

              {/* phone */}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de teléfono
              </label>
              <div className="relative">
                {/* icon phone */}
                <Phone className="absolute left-3 top-3 transform translate-y-2 text-orange-500 w-4 h-4" />

                {/* controller input */}
                <Controller
                  name="phone_number"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const prefix = "+57 ";
                      const numericPart = value.slice(prefix.length);
                      if (!numericPart) return "Escribe tu número de teléfono";
                      if (!/^[0-9]+$/.test(numericPart)) return "Solo se permiten números";
                      return true;
                    },
                  }}
                  render={({ field }) => {
                    const handlePhoneChange = (e) => {
                      const prefix = "+57 ";
                      const { value } = e.target;

                      if (!value.startsWith(prefix)) {
                        field.onChange(prefix);
                      } else {
                        const numericPart = value.slice(prefix.length).replace(/[^0-9]/g, "");
                        field.onChange(`${prefix}${numericPart}`);
                      }
                    };

                    return (
                      <input
                        {...field}
                        onChange={handlePhoneChange}
                        value={field.value}
                        placeholder="+57 123456789"
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    );
                  }}
                />

                {errors.phone_number && (
                  <p className="text-sm my-2 pl-4 text-red-600" >{errors.phone_number.message}</p>
                )}
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
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Escribe tu contraseña'
                    }
                  })}
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
              {errors.password && (
                <p className="text-sm my-2 pl-4 text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Botón de login */}
          <button
            disabled={isLoading}
            type="submit"
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

        {/* errors */}


        {/* footer */}
        {/* Enlaces adicionales */}
        <footer className="mt-4 text-center pb-6">
          {/*   <p className="text-x">
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              ¿Olvidaste tu contraseña?
            </button>
          </p> */}
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
