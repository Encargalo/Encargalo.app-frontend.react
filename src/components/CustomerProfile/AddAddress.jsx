//react
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
//services
import addAddress from "../../services/addAddress";
import deleteAddress from "../../services/deleteAddress";
import getAddressCustomer from "../../services/getAddressCustomer";
//compentns
import MapComponent from "../MapComponent";
//icons
import { DeleteIcon, Send } from "lucide-react";
import { ilustrations } from "../../assets/ilustrations";

const AddAddress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmAdd, setConfirmAdd] = useState(false);
    const [confirmDeleted, setConfirmDeleted] = useState(false);
    const [address, setAddress] = useState([]);
    const addressEmpyt = 0

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm()

    //update address
    const onUpdateAddress = (data) => {
        addAddress(data, setAddress, setConfirmAdd, setIsLoading, reset)
    }

    //delete address
    const handleDeleteAddres = (id) => {
        deleteAddress(id, setConfirmDeleted, setAddress)
    }

    //address customer
    useEffect(() => {
        getAddressCustomer(setAddress)
    }, [])

    return (
        <div className="py-6 px-5 sm:p-8">
            <header className="w-full flex flex-col items-center sm:flex-row sm:items-end sm:gap-x-4 gap-y-1">
                <h1 className="text-gray-600 text-3xl sm:text-5xl">Ubicaciones</h1>
                {confirmAdd && <p className="text-sm sm:text-xl italic text-green-600">Se agrego la ubicación correctamente</p>}
            </header>

            <form
                onSubmit={handleSubmit(onUpdateAddress)}
                className="flex flex-col gap-5 w-full py-6 sm:p-6"
            >
                {/* Nombre de la ubicación */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Nombre de la ubicación
                    </label>
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder="Mi casa"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("alias", {
                            required: "Escribe el nombre de la ubicación",
                            maxLength: {
                                value: 100,
                                message: "El nombre de la ubicación no puede ser tan largo"
                            }
                        })}
                    />
                    {errors.alias && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.alias.message}
                        </p>
                    )}
                </div>

                {/* Dirección (read only, actualizada desde el mapa) */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Ubicación actual
                    </label>
                    <input
                        type="text"
                        readOnly
                        placeholder="Urbanizacion, Ciudad, Estado, País"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("address", {
                            required: "Selecciona tu ubicación en el mapa",
                        })}
                    />
                    {errors.address && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.address.message}
                        </p>
                    )}
                </div>

                {/* Mapa interactivo */}
                <MapComponent
                    onAddressSelect={({ address, coords }) => {
                        setValue("address", address, { shouldValidate: true });
                        setValue("coords", coords); // ojo: usa siempre "coords"
                    }}
                />

                {/* Referencia */}
                <div>
                    <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">
                        Referencia
                    </label>
                    <input
                        type="text"
                        placeholder="Edif. 3, apto. 3, Calle #2, Mi urbanización, al lado del local azul"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("reference", {
                            required: "Escribe una referencia",
                            maxLength: {
                                value: 100,
                                message: "La referencia no puede ser tan larga"
                            }
                        })}
                    />
                    {errors.reference && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.reference.message}
                        </p>
                    )}
                </div>

                {/* Botón */}
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
                            'Añadir'
                        )}
                    </button>
                </div>
            </form>

            {/* adddres */}

            <footer className="w-full space-y-5">
                <div className="w-full flex items-end gap-x-4">
                </div>
                {
                    address.length === addressEmpyt ?
                        <>
                            <h1 className="text-2xl sm:text-4xl text-center">Tus ubicaciones se mostraran aquí</h1>
                            <div className="flex flex-col justify-center items-center">
                                <img src={ilustrations.Map167} alt={ilustrations.Map167} className="w-2/3 sm:w-1/2 object-cover" />
                                <p className="text-sm sm:text-2xl text-center text-gray-600">Añade nuevas ubicaciones para poder llevar tus pedidos a la puerta de tu casa</p>
                            </div>
                        </>
                        :
                        <>
                            <h1 className="text-3xl sm:text-5xl">Mis ubicaciones</h1>
                            {confirmDeleted && <p className="text-xl italic text-green-600">Se elimino la ubicación</p>}
                            <ul className="flex flex-col gap-y-5">
                                {
                                    address &&
                                    address.map((item, index) => (
                                        <li
                                            key={index + item.alias}
                                            className="flex flex-col sm:flex-row items-start justify-between gap-y-3 sm:gap-0 w-full shadow-md px-6 py-5 border-2 border-gray-200 rounded-xl hover:shadow-lg transition"
                                        >
                                            {/* icon + info */}
                                            <div className="flex items-start gap-4">
                                                <Send className="text-orange-500 size-7 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xl sm:text-2xl font-semibold text-gray-700 uppercase">
                                                        {item.alias}
                                                    </p>
                                                    <p className="sm:text-xl text-gray-600">{item.address}</p>
                                                    <p className="sm:text-xl text-gray-600">{item.reference}</p>
                                                </div>
                                            </div>

                                            {/* acciones */}
                                            <button
                                                onClick={() => handleDeleteAddres(item.id)}
                                                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition w-full sm:w-max"
                                            >
                                                <DeleteIcon className="text-2xl" />
                                                <span className="text-lg font-medium">Eliminar</span>
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                }


            </footer>
        </div>
    )
}

export default AddAddress;
