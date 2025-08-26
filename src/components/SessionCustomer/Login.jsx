//icons
import { Phone, Lock, Eye, EyeOff, X } from "lucide-react";
//react
import { Controller, useForm } from "react-hook-form";
//services
import logInCustomers from "../../services/logInCustomers";
//stores/hooks
import useOnLoginStore from "../../store/onLoginStore";

const Login = ({ showPassword, setShowPassword, isLoading, setIsLoading, session, setSession }) => {

    const { setAddress, openWelcomeModal, closeLoginModal } = useOnLoginStore()


    //form data
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            phone_number: "+57",
            password: "",
        },
    });

    const onLogin = (data) => {
        const formattedData = {
            ...data,
            phone_number: data.phone_number.replace(/\s+/g, ""),
        };
        logInCustomers(
            formattedData,
            setIsLoading,
            setError,
            closeLoginModal,
            openWelcomeModal,
            setAddress,
        );
    };

    return (
        <section className="bg-white rounded-2xl shadow-2xl p-6 w-full lg:w-2/5">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-9 lg:py-12 lg:px-10 rounded-t-2xl -mx-6 -mt-6 mb-7">
                <figure className="flex items-center justify-between gap-2 sm:gap-20">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white">Iniciar Sesión</h2>
                    <button
                        onClick={closeLoginModal}
                        className="text-white hover:text-orange-200 p-2 rounded-full bg-orange-400"
                    >
                        <X />
                    </button>
                </figure>
                <p className="text-orange-100 mt-1 text-base sm:text-xl">
                    Ingresa tu número y contraseña
                </p>
            </header>

            {/* Formulario Login */}
            <form onSubmit={handleSubmit(onLogin)} className="sm:space-y-8 space-y-5 sm:px-3">
                {/* Teléfono */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Número de teléfono
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <Controller
                            name="phone_number"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    const prefix = "+57 ";
                                    const numericPart = value.slice(prefix.length);
                                    if (!numericPart) return "Escribe tu número de teléfono";
                                    if (!/^[0-9]+$/.test(numericPart))
                                        return "Solo se permiten números";
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
                                        const numericPart = value
                                            .slice(prefix.length)
                                            .replace(/[^0-9]/g, "");
                                        field.onChange(`${prefix}${numericPart}`);
                                    }
                                };
                                return (
                                    <input
                                        {...field}
                                        onChange={handlePhoneChange}
                                        value={field.value}
                                        placeholder="+57 123456789"
                                        className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                    />
                                );
                            }}
                        />
                        {errors.phone_number && (
                            <p className="text-sm my-2 pl-4 text-red-600">
                                {errors.phone_number.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Escribe tu contraseña",
                                },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                        >
                            {showPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm my-2 pl-4 text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Botón login */}
                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 rounded-xl text-xl mt-6 shadow-lg"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full size-7 border-2 border-white border-t-transparent"></div>
                        </div>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </form>

            {/* Footer */}
            <footer className="mt-8 mb-4 flex items-center  justify-center gap-1 sm:gap-10 w-full">
                <p className="text-gray-600">
                    ¿No tienes cuenta?
                </p>
                <button
                    onClick={() => setSession(!session)}
                    className="text-orange-500 p-1 sm:p-4 hover:text-orange-600 font-medium text-xl"
                >
                    Regístrate aquí
                </button>
            </footer>
        </section>
    )
}

export default Login