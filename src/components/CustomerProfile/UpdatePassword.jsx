import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import updatePassword from "../../services/updatePassword";

const UpdatePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm()

    //password
    const password = watch("password")

    const onUpdatePassword = (data) => {
        const objPassword = {
            password: data.password
        }
        updatePassword(objPassword, setIsLoading, setConfirmUpdate, reset)
    }



    return (
        <div className="p-8">
            <header className="w-full flex flex-col items-center sm:flex-row sm:items-end sm:gap-x-4 gap-y-1">
                <h1 className="text-gray-600 text-3xl sm:text-4xl">Contraseña</h1>
                {confirmUpdate && <p className="text-sm sm:text-lg italic text-green-600">Se cambio la contraseña correctamente</p>}
            </header>


            <form
                onSubmit={handleSubmit(onUpdatePassword)}
                className="flex flex-col gap-5 w-full py-6 sm:p-6"
            >

                {/* passsword */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                        Nueva contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            className="w-full pl-10 pr-3 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register("password", {
                                required: "Escribe tu contraseña"
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
                        <p className="text-base my-2 pl-4 text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* update passoword */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <Check className="absolute left-3 top-4 sm:top-5 text-orange-500 size-5" />
                        <input
                            name="confirm_password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirma tu contraseña"
                            className="w-full pl-10 pr-10 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                            {...register("confirm_password", {
                                required: "Confirma la contraseña",
                                validate: (value) =>
                                    value === password || "Las contraseñas no coinciden",
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
                    {errors.confirm_password && (
                        <p className="text-base my-2 pl-4 text-red-600">
                            {errors.confirm_password.message}
                        </p>
                    )}
                </div>

                {/* Button change passoword */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full flex items-center justify-center">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:text-lg text-lg w-full"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full size-7 border-2 border-white border-t-transparent"></div>
                            </div>
                        ) : (
                            'Cambiar contraseña'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdatePassword