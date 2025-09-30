//react
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
//stores/hooks
import usePlaceOrderStore from "../store/placeOrderStore";
import useCartStore from "../store/cartStore";
import useNumberFormat from "../hooks/useNumberFormat";
import useOnLoginStore from "../store/onLoginStore";
import getAddressCustomer from "../services/getAddressCustomer";
import { buildWhatsAppMessage } from "../lib/cartUtils";
import { getDecryptedItem, setEncryptedItem, removeItem } from "../utils/encryptionUtilities";
import SessionModal from "./SessionCustomer/SessionModal";
import WelcomeCustomerModal from "./WelcomeCustomerModal";
import generateUUIDv4 from "../utils/generateUUIDv4";
import sendOrders from "../services/sendOrders";

export const preprocessCartItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
        const isMultiSelect = item.rules?.some(r => r.rule_key === 'max_flavors' && r.selector_type === 'multi_select');
        const flavorCount = item.flavors?.reduce((sum, f) => sum + (f.quantity || 1), 0) || 0;

        // La cantidad es el total de sabores para multi_select, o la cantidad del item para otros casos.
        const quantity = isMultiSelect && flavorCount > 0 ? flavorCount : item.quantity || 1;

        const additionalsPricePerUnit = (item.additionals || []).reduce((sum, add) => sum + (add.price || 0), 0);

        // El subtotal se basa en el precio del item multiplicado por la cantidad de sabores (si es multi_select)
        // o por la cantidad del producto.
        const subtotal = isMultiSelect ? (item.price * quantity) + additionalsPricePerUnit
            : (item.price + additionalsPricePerUnit) * quantity;

        return { ...item, quantity, subtotal };
    });
};

const CheckoutShopping = () => {
    const navigate = useNavigate();
    const { placeOrder, clearPlaceOrder, setPlaceOrder } = usePlaceOrderStore();
    const { removeShopItems, clearCart } = useCartStore();
    const { formatNumber } = useNumberFormat();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [note, setNote] = useState("");
    const PAYMENT_METHOD_KEY = "encargalo_payment_method";
    const [paymentMethod, setPaymentMethod] = useState(() => {
        // Recupera el método de pago guardado en localStorage al cargar
        return localStorage.getItem(PAYMENT_METHOD_KEY) || "";
    });

    const CHECKOUT_ORDER_KEY = import.meta.env.VITE_CHECKOUT_ORDER_KEY;
    const checkAddress = addresses?.length > 0

    // Sincroniza el pedido con localStorage ENCRIPTADO
    useEffect(() => {
        if (placeOrder && placeOrder.items && placeOrder.items.length > 0) {
            setEncryptedItem(CHECKOUT_ORDER_KEY, placeOrder);
        }
    }, [placeOrder]);

    // Al montar, si no hay pedido en el store, intenta cargarlo del localStorage ENCRIPTADO
    useEffect(() => {
        if (!placeOrder || !placeOrder.items || placeOrder.items.length === 0) {
            const saved = getDecryptedItem(CHECKOUT_ORDER_KEY);
            if (saved && saved.items && saved.items.length > 0) {
                if (typeof setPlaceOrder === "function") setPlaceOrder(saved);
            }
        }
        // eslint-disable-next-line
    }, []);

    // Carga direcciones guardadas
    const fetchAddresses = () => {
        getAddressCustomer(setAddresses);
    };
    useEffect(fetchAddresses, []);

    //Up scroll
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Seleccionar la primera por defecto
    useEffect(() => {
        if (addresses?.length > 0 && selectedAddressId === null) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const processedItems = useMemo(
        () => preprocessCartItems(placeOrder?.items || []),
        [placeOrder?.items]
    );

    const total = useMemo(
        () => processedItems.reduce((sum, it) => sum + it.subtotal, 0),
        [processedItems]
    );

    // Datos del usuario (si manejas sesión encriptada como en Header)
    const user_session_key = import.meta.env.VITE_USER_SESSION;
    const userSession = getDecryptedItem(user_session_key);
    const buyerName = userSession?.data?.name + " " + userSession?.data?.sur_name || "";
    const buyerWhatsapp = userSession?.data?.phone || "";

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    // Guarda el método de pago en localStorage cada vez que cambie
    useEffect(() => {
        if (paymentMethod) {
            localStorage.setItem(PAYMENT_METHOD_KEY, paymentMethod);
        }
    }, [paymentMethod]);


    //Send order server
    const Orders = {
        id: generateUUIDv4(),
        shop_id: placeOrder?.shopInfo.id || "",
        method_payment: paymentMethod,
        address: {
            address: selectedAddress?.address,
            latitude: selectedAddress?.coords?.lat,
            longitude: selectedAddress?.coords?.long,
        },

        items: processedItems.map(item => {
            const orderItem = {
                item_id: item.id,
                amount: item.quantity,
                observation: item.observation || ""
            };

            if (item.additionals && item.additionals.length > 0) {
                orderItem.additions = item.additionals.map(add => ({ addition_id: add.id }));
            }
            return orderItem;
        })
    }

    const handleSend = () => {
        // Construye datos de compra para el mensaje
        const purchaseData = {
            full_name: buyerName,
            direction: selectedAddress?.address || "",
            reference: selectedAddress?.reference || "",
            coords: selectedAddress?.coords || null,
            whatsapp: buyerWhatsapp,
            payment_method: paymentMethod, // Cambiado aquí
            note: note || "",
        };

        const msg = buildWhatsAppMessage(
            processedItems,
            placeOrder?.shopInfo.name || "",
            purchaseData,
            formatNumber
        );

        const phone = placeOrder.shopInfo.home_phone;
        // Limpia solo productos de la tienda actual
        if (placeOrder?.shopId) removeShopItems(placeOrder.shopId);

        sendOrders(Orders)
        clearPlaceOrder();
        clearCart()
        navigate("/");
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");

        // Elimina el método de pago guardado al enviar el pedido
        localStorage.removeItem(PAYMENT_METHOD_KEY);
    };

    //user data
    const user_session = userSession?.session;
    const session_create = true

    //validate select payment_metod
    const validate_paymentMethod = paymentMethod !== ""


    //onLogin
    const { openLoginModal } = useOnLoginStore()


    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100">
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            Confirmar pedido
                        </h1>
                        <p className="text-gray-600 sm:text-lg">
                            Selecciona tu dirección y revisa el resumen antes de enviar.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Direcciones */}
                    <section className="lg:col-span-3 space-y-4">
                        <div className="bg-white border border-gray-300 rounded-2xl p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    Tus direcciones
                                </h2>
                                {user_session === session_create && (
                                    <button onClick={() => navigate("/customer_profile/address")} className="text-orange-600 hover:text-orange-800 font-semibold px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors mt-2 sm:mt-0">
                                        Agregar nueva dirreción
                                    </button>
                                )}
                            </div>
                            {addresses?.length > 0 ? (
                                <ul className="space-y-3 mt-3">
                                    {addresses.map((a) => (
                                        <li
                                            key={a.id}
                                            className={`p-4 border rounded-xl cursor-pointer transition${selectedAddressId === a.id
                                                ? "bg-orange-400 hover:bg-orange-100 border-gray-400"
                                                : "border-gray-00 hover:bg-gray-100"
                                                }`}
                                            onClick={() => setSelectedAddressId(a.id)}
                                        >
                                            <div className="flex items-start justify-between gap-y-3">
                                                <div className="space-y-1">
                                                    <p className="text-xl font-semibold text-gray-800">
                                                        {a.alias}
                                                    </p>
                                                    <p className="sm:text-lg text-gray-600">{a.address}</p>
                                                    {a.reference && (
                                                        <p className="sm:text-base text-gray-500">
                                                            Ref.: {a.reference}
                                                        </p>
                                                    )}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddressId === a.id}
                                                    onChange={() => setSelectedAddressId(a.id)}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : user_session === session_create ? (
                                <div className="text-gray-600 flex flex-col sm:flex-row sm:items-center h-full space-x-4 space-y-4 sm:space-y-0">
                                    <span>Debes agregar una dirección para realizar el pedido</span>
                                    <button onClick={() => navigate("/customer_profile/address")} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60">Agregar nueva dirreción</button>
                                </div>) : (
                                <div className="space-y-3 text-lg">
                                    <p>Inicia sessión para poder agregar tus direcciones</p>
                                </div>
                            )}


                            {/*  <div className="mt-4">
                                <button
                                    onClick={() => setShowNewAddress((s) => !s)}
                                    className="w-full rounded-xl border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-3 font-semibold transition"
                                >
                                    {showNewAddress ? "Ocultar formulario" : "Usar otra dirección"}
                                </button>
                            </div> */}
                        </div>

                        {showNewAddress && (
                            <InlineNewAddress
                                onAdded={() => {
                                    setShowNewAddress(false);
                                    fetchAddresses();
                                }}
                            />
                        )}

                        {/* Datos extra */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                Detalles del pago y notas
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="flex items-center gap-x-2 mb-3">
                                        <label className="block text-lg sm:text-xl font-semibold text-gray-700">
                                            Método de pago
                                        </label>
                                        {!paymentMethod && <span className="text-red-500 text-sm font-medium">(requerido)</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("Efectivo")}
                                            className={`w-full px-4 py-3 rounded-xl font-semibold shadow transition
                                            ${paymentMethod === "Efectivo"
                                                    ? "bg-green-500 text-white border-2 border-green-600"
                                                    : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"}
                                                `}
                                        >
                                            Efectivo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("Nequi")}
                                            className={`w-full px-4 py-3 rounded-xl font-semibold shadow transition
            ${paymentMethod === "Nequi"
                                                    ? "bg-[#FB0889] text-white"
                                                    : "bg-pink-50 text-pink-700 border-2 border-pink-200 hover:bg-pink-100"}
        `}
                                        >
                                            Nequi
                                        </button>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-1">
                                        Nota para el repartidor (opcional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                        placeholder="¡Cuidado con el perro!"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resumen */}
                    <aside className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                                Resumen del pedido
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {processedItems.map((item, idx) => (
                                    <li key={`${item.id}-${idx}`} className="py-4 flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-24 rounded-xl object-cover border border-gray-200"
                                        />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-800 text-xl">
                                                    {item.name}
                                                </p>
                                                <span className="text-lg sm:text-base text-gray-600">
                                                    x{item.rules?.some(r => r.selector_type === 'multi_select') ? item.flavors.reduce((acc, f) => acc + f.quantity, 0) : item.quantity}
                                                </span>
                                            </div>
                                            {item.additionals?.length > 0 && (
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Adicionales:</span>{" "}
                                                    {item.additionals.map((a) => a.name).join(", ")}
                                                </p>
                                            )}
                                            {item.flavors?.length > 0 && (
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Sabores:</span>{" "}
                                                    {item.flavors.map(f =>
                                                        f.quantity > 1
                                                            ? `${f.name} (x${f.quantity})`
                                                            : f.name
                                                    )
                                                        .join(" / ")
                                                    }
                                                </p>
                                            )}
                                            {item.observation && (
                                                <p className="text-gray-500 italic">
                                                    Obs.: {item.observation}
                                                </p>
                                            )}
                                            <p className="mt-1 font-bold text-lg">
                                                ${formatNumber(item.subtotal, "es-CO")}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-gray-600 text-xl">Total</span>
                                <span className="text-2xl font-extrabold text-gray-900">
                                    ${formatNumber(total, "es-CO")}
                                </span>
                            </div>
                        </div>

                        {
                            user_session === session_create ?
                                <button
                                    disabled={!validate_paymentMethod || !selectedAddressId || !checkAddress}
                                    onClick={handleSend}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60"
                                >
                                    Enviar pedido por WhatsApp
                                </button> :

                                <div className="w-full text-lg font-medium">
                                    <h5 className="py-2 my-3 italic text-orange-800 rounded-lg">Inicia sessión o Registrate para poder enviar el pedido</h5>
                                    <button
                                        onClick={openLoginModal}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60"
                                    >
                                        Iniciar Sesión
                                    </button>

                                </div>

                        }


                        <button
                            onClick={() => navigate(-1)}
                            className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50 transition"
                        >
                            Volver al carrito
                        </button>
                    </aside>
                </div>
            </section>
            <SessionModal />
            <WelcomeCustomerModal />
        </main>
    );
};

export default CheckoutShopping;
