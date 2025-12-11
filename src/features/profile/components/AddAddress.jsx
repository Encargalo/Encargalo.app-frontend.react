//react
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
//services
import addAddress from "../services/addAddress";
import deleteAddress from "../services/deleteAddress";
import getAddressCustomer from "../services/getAddressCustomer";
//compentns
import MapComponent from "../../../components/MapComponent.jsx";
import RequestLocationModal from "../../../components/RequestLocationModal.jsx";
import Modal from "../../../components/Modal";
//icons
import { DeleteIcon, Send } from "lucide-react";
import { ilustrations } from "../../../assets/ilustrations.js";
import { getCurrentLocationAndAddress } from "../../../utils/getCurrentLocationAndAddress";

const AddAddress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmAdd, setConfirmAdd] = useState(false);
    const [confirmDeleted, setConfirmDeleted] = useState(false);
    const [address, setAddress] = useState([]);
    const [showMapModal, setShowMapModal] = useState(false);
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
        // Transformar coords.lng a coords.long si existe coords
        let newData = { ...data };
        if (newData.coords && typeof newData.coords.lng !== "undefined") {
            newData.lat = newData.coords.lat;
            newData.long = newData.coords.lng;
        }
        // Agregar campos fijos y estructura extra
        newData.type = "Home";
        newData.label = newData.label || "Mi Casa";
        newData.extra = { details: newData.details };
        newData.instructions = newData.instructions || "";

        // Limpiar campos innecesarios antes de enviar
        delete newData.coords;
        delete newData.details;

        addAddress(newData, setAddress, setConfirmAdd, setIsLoading, () => {
            reset({
                label: "",
                instructions: "",
                details: "",
                alias: "",
            });
        });
    }

    //delete address
    const handleDeleteAddres = (id) => {
        deleteAddress(id, setConfirmDeleted, setAddress)
    }

    //address customer
    useEffect(() => {
        getAddressCustomer(setAddress);

        // Obtener ubicación actual y setear en el formulario
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        getCurrentLocationAndAddress(apiKey)
            .then(({ address, coords }) => {
                setValue("address", address, { shouldValidate: true });
                setValue("coords", coords);
            })
            .catch((err) => {
                // Puedes mostrar un mensaje si lo deseas
                console.error("No se pudo obtener la ubicación actual", err);
            });
    }, [])

    return (
        <div className="py-6 sm:p-8">
            <header className="w-full flex flex-col items-center sm:flex-row sm:items-end sm:gap-x-4 gap-y-1">
                <h1 className="text-gray-600 text-3xl sm:text-4xl">Ubicaciones</h1>
                {confirmAdd && <p className="text-sm sm:text-lg italic text-green-600">Se agrego la ubicación correctamente</p>}
            </header>

            <form
                onSubmit={handleSubmit(onUpdateAddress)}
                className="flex flex-col gap-5 w-full py-6 sm:p-6"
            >
                {/* Label (nombre de la ubicación) */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                        Nombre de la ubicación
                    </label>
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder="p. ej: Mi Casa"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("label", {
                            required: "Escribe el nombre de la ubicación",
                            maxLength: {
                                value: 100,
                                message: "El nombre de la ubicación no puede ser tan largo"
                            }
                        })}
                    />
                    {errors.label && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.label.message}
                        </p>
                    )}
                </div>

                {/* Dirección (read only, actualizada desde el mapa) */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700">
                        Ubicación actual
                    </label>
                    <input
                        type="text"
                        readOnly
                        placeholder="Urbanizacion, Ciudad, Estado, País"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("address", {
                            required: "Selecciona tu ubicación en el mapa",
                        })}
                    />
                    {errors.address && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.address.message}
                        </p>
                    )}
                    <button
                        type="button"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:text-lg text-lg w-full mt-5"
                        onClick={() => setShowMapModal(true)}
                    >
                        Señalar en el mapa
                    </button>
                </div>

                {/* Instrucciones */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                        Instrucciones
                    </label>
                    <input
                        type="text"
                        placeholder="Tocar el timbre junto a la puerta"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("instructions", {
                            maxLength: {
                                value: 100,
                                message: "Las instrucciones no pueden ser tan largas"
                            }
                        })}
                    />
                    {errors.instructions && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.instructions.message}
                        </p>
                    )}
                </div>

                {/* Detalles */}
                <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                        Detalles
                    </label>
                    <input
                        type="text"
                        placeholder="Casa de dos pisos con jardín"
                        className="w-full shadow-md px-5 py-3 sm:py-4 border-2 text-lg sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                        {...register("details", {
                            required: "Escribe los detalles",
                            maxLength: {
                                value: 100,
                                message: "Los detalles no pueden ser tan largos"
                            }
                        })}
                    />
                    {errors.details && (
                        <p className="sm:text-base my-2 pl-4 text-red-600">
                            {errors.details.message}
                        </p>
                    )}
                </div>

                {/* Botón */}
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
                            'Añadir'
                        )}
                    </button>
                </div>
            </form>

            {/* my adddres */}

            <footer className="w-full space-y-5">
                <div className="w-full flex items-end gap-x-4">
                </div>
                {
                    address.length === addressEmpyt ?
                        <div className="flex flex-col justify-center items-center gap-y-2">
                            <h1 className="text-xl sm:text-3xl text-center">Tus ubicaciones se mostraran aquí</h1>
                            <p className="text-sm sm:text-xl text-center text-gray-600">Añade nuevas ubicaciones para poder llevar tus pedidos a la puerta de tu casa</p>
                            <img src={ilustrations.Map167} alt={ilustrations.Map167} className="w-2/3 sm:w-1/2 object-cover" />
                        </div>
                        :
                        <>
                            <h1 className="text-2xl sm:text-3xl">Mis ubicaciones</h1>
                            {confirmDeleted && <p className="text-xl italic text-green-600">Se elimino la ubicación</p>}
                            <ul className="flex flex-col gap-y-5">
                                {
                                    address &&
                                    address.map((item, index) => (
                                        <li
                                            key={index + item.alias}
                                            className="flex flex-col sm:flex-row items-start justify-between gap-y-3 sm:gap-0 w-full shadow-md px-6 py-5 border-2 border-gray-200 rounded-xl hover:shadow-lg transition bg-white"
                                        >
                                            {/* icon + info */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between sm:flex-row-reverse sm:justify-end sm:gap-x-3 mb-2">
                                                    <p className="text-xl font-semibold text-gray-700 uppercase">
                                                        {item.alias}
                                                    </p>
                                                    <Send className="text-orange-500 size-6" />
                                                </div>
                                                <p className="sm:text-lg text-gray-600">
                                                    <span className="font-semibold">Dirección: </span>{item.address}
                                                </p>
                                                <p className="sm:text-lg text-gray-600">
                                                    <span className="font-semibold">Instrucciones: </span>{item.instructions}
                                                </p>
                                                <p className="sm:text-lg text-gray-600">
                                                    <span className="font-semibold">Detalles: </span>
                                                    {item?.extra.map((extraItem) => (
                                                        <span key={extraItem.Key}>{extraItem.Value}</span>
                                                    ))}
                                                </p>
                                            </div>

                                            {/* acciones */}
                                            <button
                                                onClick={() => handleDeleteAddres(item.id)}
                                                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition w-full sm:w-max rounded-md p-2"
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
            {/* modals */}
            <RequestLocationModal />
            {/* Modal del mapa */}
            {showMapModal && (
                <Modal onClose={() => setShowMapModal(false)}>
                    <div className="flex flex-col gap-4">
                        <MapComponent
                            onAddressSelect={({ address, coords }) => {
                                setValue("address", address, { shouldValidate: true });
                                setValue("coords", coords);
                            }}
                            onConfirm={() => setShowMapModal(false)}
                        />

                    </div>
                </Modal>
            )}
        </div>
    )
}

export default AddAddress;
