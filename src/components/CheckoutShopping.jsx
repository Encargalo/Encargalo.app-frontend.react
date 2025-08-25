//react
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
//stores/hooks
import usePlaceOrderStore from "../store/placeOrderStore";
import useCartStore from "../store/cartStore";
import useNumberFormat from "../hooks/useNumberFormat";
//services
import getAddressCustomer from "../services/getAddressCustomer";
//components
import MapComponent from "./MapComponent";
//utils/lib
import { buildWhatsAppMessage, preprocessCartItems } from "../lib/cartUtils";
import { getDecryptedItem } from "../utils/encryptionUtilities";
//session

const InlineNewAddress = ({ onAdded }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        alias: "",
        address: "",
        reference: "",
        coords: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.alias || !form.address) return;
        setIsSaving(true);
        try {
            await addAddress(form, null, null, null, () => { });
            if (typeof onAdded === "function") onAdded();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-2xl px-5 py-6">
            <div>
                <label className="block text-sm sm:text-lg font-semibold text-gray-700 mb-1">
                    Nombre de la ubicación
                </label>
                <input
                    type="text"
                    placeholder="Mi casa"
                    value={form.alias}
                    onChange={(e) => setForm((p) => ({ ...p, alias: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
            </div>

            <div>
                <label className="block text-sm sm:text-xl font-semibold text-gray-700 mb-1">
                    Dirección
                </label>
                <input
                    readOnly
                    placeholder="Selecciona en el mapa"
                    value={form.address}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
            </div>

            <MapComponent
                onAddressSelect={({ address, coords }) => {
                    setForm((p) => ({ ...p, address, coords }));
                }}
            />

            <div>
                <label className="block text-sm sm:text-xl font-semibold text-gray-700 mb-1">
                    Referencia
                </label>
                <input
                    type="text"
                    placeholder="Edificio, piso, punto de referencia"
                    value={form.reference}
                    onChange={(e) =>
                        setForm((p) => ({ ...p, reference: e.target.value }))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60"
            >
                {isSaving ? "Guardando..." : "Guardar dirección"}
            </button>
        </form>
    );
};

const CheckoutShopping = () => {
    const navigate = useNavigate();
    const { placeOrder, clearPlaceOrder } = usePlaceOrderStore();
    const { removeShopItems } = useCartStore();
    const { formatNumber } = useNumberFormat();

    // Redirige si no hay pedido activo
    /*  useEffect(() => {
         if (!placeOrder?.items?.length) navigate("/cart");
     }, [placeOrder, navigate]); */

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [note, setNote] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [deliveryDriver, setDeliveryDriver] = useState({ name: "", phone: "" });

    // Carga direcciones guardadas
    const fetchAddresses = () => {
        getAddressCustomer(setAddresses);
    };
    useEffect(fetchAddresses, []);

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
    const buyerName = userSession?.data?.name || "";
    const buyerWhatsapp = userSession?.data?.phone || "";

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    const handleSend = () => {
        // Construye datos de compra para el mensaje
        const purchaseData = {
            full_name: buyerName,
            direction: selectedAddress?.address || "",
            neighborhood: selectedAddress?.alias || "",
            whatsapp: buyerWhatsapp,
            payment_amount: paymentAmount ? Number(paymentAmount) : undefined,
        };

        const msg = buildWhatsAppMessage(
            processedItems,
            placeOrder?.shopName || "",
            purchaseData,
            formatNumber
        );

        const phone = import.meta.env.VITE_PHONE_DMO;
        // Limpia solo productos de la tienda actual
        if (placeOrder?.shopId) removeShopItems(placeOrder.shopId);

        clearPlaceOrder();
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
        navigate("/"); // vuelve a inicio
    };

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
                    <button
                        onClick={() => navigate(-1)}
                        className="sm:text-lg rounded-xl border border-gray-200 px-4 py-2 font-semibold hover:bg-gray-50"
                    >
                        Volver
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Direcciones */}
                    <section className="lg:col-span-3 space-y-4">
                        <div className="bg-white border border-gray-300 rounded-2xl p-5">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                                Tus direcciones
                            </h2>

                            {addresses?.length > 0 ? (
                                <ul className="space-y-3">
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
                            ) : (
                                <p className="text-gray-600">
                                    Aún no tienes direcciones guardadas.
                                </p>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={() => setShowNewAddress((s) => !s)}
                                    className="w-full rounded-xl border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-3 font-semibold transition"
                                >
                                    {showNewAddress ? "Ocultar formulario" : "Usar otra dirección"}
                                </button>
                            </div>
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
                                    <label className="block text-lg sm:text-xl font-semibold text-gray-700 mb-1">
                                        Monto con el que pagas (opcional)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ej.: 50000"
                                    />
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
                                        placeholder="Portón negro, dejar en recepción..."
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
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            {item.additionals?.length > 0 && (
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Adicionales:</span>{" "}
                                                    {item.additionals.map((a) => a.name).join(", ")}
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

                        <button
                            disabled={!selectedAddress && !showNewAddress}
                            onClick={handleSend}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60"
                        >
                            Enviar pedido por WhatsApp
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50 transition"
                        >
                            Volver al carrito
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default CheckoutShopping;
