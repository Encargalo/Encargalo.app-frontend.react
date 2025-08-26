//icons
import { Phone, Lock, Eye, EyeOff, X, User, IdCard, Mail } from 'lucide-react';
//react
import { Controller, useForm } from 'react-hook-form';
//components
import InputCalendar from '../InputCalendar';
import signupCustomer from '../../services/signupCustomer';
import useOnLoginStore from '../../store/onLoginStore';

const SignUp = ({
    showPassword,
    setShowPassword,
    isLoading,
    setIsLoading,
    session,
    setSession,
}) => {

    const { setAddress, openWelcomeModal, closeLoginModal } = useOnLoginStore()


    //form data
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            sur_name: '',
            email: '',
            birthday_date: '',
            phone: '+57',
            password: '',
        },
    });

    const onSignUp = (data) => {
        const formattedData = {
            ...data,
            phone: data.phone.replace(/\s+/g, ''),
        };
        signupCustomer(
            formattedData,
            setIsLoading,
            setError,
            reset,
            closeLoginModal,
            openWelcomeModal,
            setAddress
        );
    };

    return (
        <section className="bg-white rounded-2xl shadow-2xl p-6 w-[60em] h-[40em] sm:h-max overflow-x-auto sm:overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-9 lg:py-12 lg:px-12 rounded-t-2xl -mx-6 -mt-6 mb-7">
                <figure className="flex items-center justify-between gap-2 sm:gap-20">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white">
                        Registrate
                    </h2>
                    <button
                        onClick={closeLoginModal}
                        className="text-white hover:text-orange-200 p-2 rounded-full bg-orange-400"
                    >
                        <X />
                    </button>
                </figure>
                <p className="text-orange-100 mt-1 text-base sm:text-xl">
                    Registrate para realizar tu primer pedido
                </p>
            </header>
            {/* Formulario Login */}
            <form
                onSubmit={handleSubmit(onSignUp)}
                className="
                  grid grid-flow-row
                  grid-cols-1 gap-y-4 gap-x-3
                  sm:grid-cols-2 sm:px-5
                  lg:grid-cols-3 lg:gap-x-3 lg:gap-y-8
                  "
            >
                {/* name */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Nombre
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Escribe tu nombre"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register('name', {
                                required: 'Escribe tu nombre',
                                pattern: {
                                    value: /^[\p{L}\s]{3,}$/u,
                                    message:
                                        'Mínimo 3 letras y solo se permiten caracteres válidos',
                                },
                            })}
                        />
                    </div>
                    {errors.name && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* surn_name */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Apellido
                    </label>
                    <div className="relative">
                        <IdCard className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            id="sur_name"
                            name="sur_name"
                            type="text"
                            placeholder="Escribe tu Apellido"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register('sur_name', {
                                required: 'Escribe tu apellido',
                                pattern: {
                                    value: /^[\p{L}\s]{3,}$/u,
                                    message:
                                        'Mínimo 3 letras y solo se permiten caracteres válidos',
                                },
                            })}
                        />
                    </div>
                    {errors.sur_name && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.sur_name.message}
                        </p>
                    )}
                </div>

                {/* phone */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Número de teléfono
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                validate: {
                                    // 1) No ha escrito nada (o solo el prefijo)
                                    requerido: (value) => {
                                        const prefix = '+57 ';
                                        if (!value || value === '+57' || value === prefix) {
                                            return 'Escribe tu número de teléfono';
                                        }
                                        return true;
                                    },
                                    // 2) Solo números después del prefijo
                                    soloNumeros: (value) => {
                                        const prefix = '+57 ';
                                        const numericPart = value.startsWith(prefix)
                                            ? value.slice(prefix.length)
                                            : value.replace(/^\+57\s?/, '');
                                        if (!/^\d*$/.test(numericPart))
                                            return 'Solo se permiten números';
                                        return true;
                                    },
                                    // 3) Longitud exacta de 10 dígitos (incompleto / demasiado largo)
                                    longitud: (value) => {
                                        const prefix = '+57 ';
                                        const numericPart = value.startsWith(prefix)
                                            ? value.slice(prefix.length)
                                            : value.replace(/^\+57\s?/, '');
                                        if (numericPart.length < 10)
                                            return 'El número está incompleto (deben ser 10 dígitos)';
                                        if (numericPart.length > 10)
                                            return 'El número tiene demasiados dígitos (deben ser 10)';
                                        return true;
                                    },
                                    // 4) Formato final exacto
                                    formato: (value) => {
                                        return (
                                            /^\+57\s\d{10}$/.test(value) ||
                                            'El formato no es válido (usa: +57 3171812128)'
                                        );
                                    },
                                },
                            }}
                            render={({ field }) => {
                                const handlePhoneChange = (e) => {
                                    const prefix = '+57 ';
                                    const { value } = e.target;

                                    if (!value.startsWith(prefix)) {
                                        // Mantiene el prefijo y conserva lo que el usuario intentó escribir como dígitos
                                        const attempted = value.replace(/^\+?57\s?/, '');
                                        const numericPart = attempted.replace(/\D/g, '');
                                        field.onChange(`${prefix}${numericPart}`);
                                    } else {
                                        const numericPart = value
                                            .slice(prefix.length)
                                            .replace(/\D/g, '');
                                        field.onChange(`${prefix}${numericPart}`);
                                    }
                                };

                                return (
                                    <input
                                        {...field}
                                        onChange={handlePhoneChange}
                                        value={field.value}
                                        type="tel"
                                        placeholder="+57 1234567890"
                                        className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                    />
                                );
                            }}
                        />
                        {errors.phone && (
                            <p className="sm:text-base my-2 pl-4 text-red-600">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* email */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Email (Opcional)
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Escribe tu Email"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register('email', {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Formato de email inválido',
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Birt data */}
                <InputCalendar
                    label="Fecha de nacimiento"
                    id="birthday_date"
                    name="birthday_date"
                    register={register}
                    errors={errors}
                    rules={{
                        required: 'Selecciona tu fecha de nacimiento',
                        pattern: {
                            value: /^\d{4}-\d{2}-\d{2}$/,
                            message: 'Formato inválido (YYYY-MM-DD)',
                        },
                        validate: (value) => {
                            const today = new Date();
                            const birth = new Date(value);
                            const age =
                                today.getFullYear() -
                                birth.getFullYear() -
                                (today <
                                    new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
                                    ? 1
                                    : 0);
                            return age >= 18 || 'Debes ser mayor de 18 años';
                        },
                    }}
                />

                {/* Password */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ingresa tu contraseña"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register('password', {
                                required: 'Escribe tu contraseña',
                                pattern: {
                                    value: /^.{8,}$/,
                                    message: 'La contraseña debe tener al menos 8 caracteres',
                                },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 lg:right-1"
                        >
                            {showPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Botón login */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full flex items-center justify-center">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full sm:w-2/4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 rounded-xl text-xl mt-6 shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full size-7 border-2 border-white border-t-transparent"></div>
                            </div>
                        ) : (
                            'Registrate'
                        )}
                    </button>
                </div>
            </form>

            {/* Footer */}
            <footer className="mt-8 mb-4 flex items-center gap-5 justify-center sm:gap-10 w-full">
                <p className="text-gray-600">¿Ya tienes cuenta?</p>
                <button
                    onClick={() => setSession(!session)}
                    className="text-orange-500 p-1 sm:p-4 hover:text-orange-600 font-medium sm:text-2xl text-xl"
                >
                    Inicia Sesión
                </button>
            </footer>
        </section>
    );
};

export default SignUp;
