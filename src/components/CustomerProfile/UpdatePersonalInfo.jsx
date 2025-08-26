//icons
import { Eye, EyeOff, IdCard, Mail, Phone, User, Lock } from "lucide-react"
//react
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react";
//utils
import { getDecryptedItem } from "../../utils/encryptionUtilities";
//components
import InputCalendar from "../InputCalendar"
import updatePersonalInfo from "../../services/updatePersonalInfo";

const UpdatePersonalInfo = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  //get user data
  useEffect(() => {
    const user_session = import.meta.env.VITE_USER_SESSION;
    const data = getDecryptedItem(user_session)
    setUser(data.data)

  }, [])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      sur_name: "",
      phone: "",
      email: "",
      birthday_date: "",
    }
  })

  //reset data
  useEffect(() => {
    if (user) {
      const cleanPhone = user.phone.replace(/^\+57\s?/, "")
      reset({
        name: user.name || "",
        sur_name: user.sur_name || "",
        phone: `+57 ${cleanPhone || ""}`,
        email: user.email || "",
        birthday_date: user.birthday_date || "",
      })
    }
  }, [user, reset])


  const onUpdateData = (data) => {
    const formattedData = {
      ...data,
      phone: data.phone.replace(/\s+/g, ''),
    };

    updatePersonalInfo(formattedData, setConfirmUpdate, setIsLoading)
  }


  return (
    <div className="py-6 px-5 sm:p-8">
      <header className="w-full flex flex-col items-center sm:flex-row sm:items-end sm:gap-x-4 gap-y-1">
        <h1 className="text-gray-600 text-3xl sm:text-5xl">Perfil</h1>
        {confirmUpdate && <p className="text-sm sm:text-xl italic text-green-600 w-full">Los datos se actualizaron correctamente</p>}
      </header>


      <form
        onSubmit={handleSubmit(onUpdateData)}
        className="flex flex-col gap-5 w-full py-6 sm:p-6"
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
              className="w-full shadow-md pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
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
              className="w-full shadow-md pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
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
                    className="w-full shadow-md pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
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
              className="w-full shadow-md pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
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

        {/* Botón login */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full flex items-center justify-center">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full sm:w-2/4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 rounded-xl text-xl mt-2 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full size-7 border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              'Actualizar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePersonalInfo