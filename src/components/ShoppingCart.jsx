//react
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ilustrations } from "../assets/ilustrations";
//store/hooks
import useCartStore from "../store/cartStore";
import usePlaceOrderStore from "../store/placeOrderStore";
import useNumberFormat from "../hooks/useNumberFormat";
//assets (opcional: si tienes ilustraciones)
import { removeItem } from "../utils/encryptionUtilities";

export const preprocessCartItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
        const isMultiSelect = item.rules?.some(r => r.rule_key === 'max_flavors' && r.selector_type === 'multi_select');
        const flavorCount = item.flavors?.reduce((sum, f) => sum + (f.quantity || 1), 0) || 0;

        // La cantidad es el total de sabores para multi_select, o la cantidad del item para otros casos.
        const quantity = isMultiSelect && flavorCount > 0 ? flavorCount : item.quantity || 1;

        const additionalsPricePerUnit = (item.additionals || []).reduce((sum, add) => sum + (add.price || 0), 0);

        const baseProductTotal = item.price * quantity;
        const totalAdditionals = isMultiSelect ? additionalsPricePerUnit : additionalsPricePerUnit * quantity;
        const subtotal = baseProductTotal + totalAdditionals;

        return {
            ...item,
            quantity,
            subtotal,
            unitPrice: item.price,
            baseProductTotal,
            totalAdditionals,
        };
    });
};

const ShoppingCart = () => {
    const navigate = useNavigate();
    const { cart = [], addItem, removeItemQuantity, clearCart, removeShopItems } = useCartStore();
    const { setPlaceOrder } = usePlaceOrderStore();
    const { formatNumber } = useNumberFormat();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Borra el resumen del pedido encriptado al entrar al carrito
        removeItem("encargalo_checkout_order");
    }, []);

    const processed = useMemo(() => preprocessCartItems(cart), [cart]);

    const groupedByShop = useMemo(() => {
        return processed.reduce((acc, item) => {
            const shopId = item?.shopInfo?.id ?? "sin-tienda";
            if (!acc[shopId]) {
                acc[shopId] = {
                    shopInfo: item.shopInfo ?? { id: "sin-tienda", name: "Sin tienda" },
                    items: [],
                };
            }
            acc[shopId].items.push(item);
            return acc;
        }, {});
    }, [processed]);

    const handlePlaceOrder = (shopInfo, items) => {
        setPlaceOrder({ shopInfo, items });
        navigate("/shopping_cart/checkout");
    };

    const isEmpty = cart.length === 0;

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100">
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                    <div className="mb-3 sm:mb-0">
                        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            Tu carrito
                        </h1>
                        <p className="text-gray-600 mt-1 sm:text-lg">
                            Revisa tus productos por tienda y confirma tu pedido.
                        </p>
                    </div>

                    <div className="sm:space-x-3 space-y-3">

                        <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition" onClick={() => navigate(-1)}>
                            Volver al menú
                        </button>

                    </div>

                </header>

                {isEmpty ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 sm:p-12 text-center">
                        {ilustrations.fastFood1 && (
                            <img
                                src={ilustrations.fastFood1}
                                alt="Carrito vacío"
                                className="mx-auto w-48 sm:w-60 mb-6"
                            />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tu carrito está vacío
                        </h2>
                        <p className="text-gray-600">
                            Aquí estaran todos tus pedidos.
                        </p>
                        <p>¿Qué esperas para pedir?</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.values(groupedByShop).map((group) => {
                            const totalShop = group.items.reduce(
                                (sum, it) => sum + it.subtotal,
                                0
                            );

                            return (
                                <article
                                    key={group.shopInfo.id}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm"
                                >
                                    {/* Header tienda */}
                                    <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-gray-100">
                                        <div>
                                            <h3 className="text-2xl sm:text-2xl font-bold text-gray-800">
                                                {group.shopInfo.name}
                                            </h3>
                                            <p className="sm:text-lg text-gray-500">
                                                {group.items.length} producto
                                                {group.items.length > 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg sm:text-xl text-gray-500">Total tienda</p>
                                            <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
                                                ${formatNumber(totalShop, "es-CO")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lista de productos */}
                                    <ul className="divide-y divide-gray-200">
                                        {group.items.map((item, idx) => (
                                            <li
                                                key={`${item.id}-${idx}`}
                                                className="py-5 px-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                                            >
                                                {/* detalle */}
                                                <div className="flex gap-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="size-20 sm:size-24 rounded-xl object-cover border border-gray-200"
                                                    />
                                                    <div className="space-y-2 sm:space-y-1">
                                                        <h4 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                                            {item.name}
                                                        </h4>
                                                        {item.description && (
                                                            <p className="sm:text-lg text-gray-600">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.additionals?.length > 0 && (
                                                            <div className="text-gray-700">
                                                                <span className="font-semibold">
                                                                    Adicionales:
                                                                </span>{" "}
                                                                {item.additionals
                                                                    .map((a) => a.name)
                                                                    .join(", ")}
                                                            </div>
                                                        )}
                                                        {item.flavors?.length > 0 && (
                                                            <div className="text-gray-700">
                                                                <span className="font-semibold">
                                                                    Sabores:
                                                                </span>{" "}
                                                                {item.flavors.map(f =>
                                                                    f.quantity > 1
                                                                        ? `${f.name} (x${f.quantity})`
                                                                        : f.name
                                                                )
                                                                    .join(" / ")
                                                                }
                                                            </div>
                                                        )}
                                                        {item.observation && (
                                                            <p className="text-gray-600 italic">
                                                                <span className="font-semibold">Obs.:</span> {item.observation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* precio / cantidad / acciones */}
                                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                                                    <div className="text-right">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center gap-4">
                                                                <span className="text-gray-500">Unitario:</span>
                                                                <span className="font-semibold">${formatNumber(item.unitPrice, "es-CO")}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center gap-4">
                                                                <span className="text-gray-500">Total Prod.:</span>
                                                                <span className="font-semibold">${formatNumber(item.baseProductTotal, "es-CO")}</span>
                                                            </div>
                                                            {item.totalAdditionals > 0 && (
                                                                <div className="flex justify-between items-center gap-4">
                                                                    <span className="text-gray-500">Adicionales:</span>
                                                                    <span className="font-semibold">${formatNumber(item.totalAdditionals, "es-CO")}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center gap-4 pt-1 border-t mt-1">
                                                                <span className="text-gray-500 font-bold">Subtotal:</span>
                                                                <span className="font-extrabold text-gray-900 text-lg">
                                                                    ${formatNumber(item.subtotal, "es-CO")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!item.rules?.some(r => r.selector_type === 'multi_select') ? (
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    removeItemQuantity(item)
                                                                }
                                                                className="px-4 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-semibold"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="min-w-10 text-center font-bold sm:text-xl">
                                                                x{item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    addItem({ ...item, quantity: 1 })
                                                                }
                                                                className="px-4 py-2 sm:px-4 sm:py-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100 font-semibold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* acciones tienda */}
                                    <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <div className="text-gray-600">
                                            ¿Listo para pedir en{" "}
                                            <span className="font-semibold sm:text-lg">{group.shopInfo.name}</span>?
                                        </div>

                                        <div className="flex justify-between items-center flex-col sm:flex-row-reverse w-full sm:w-auto gap-3">
                                            <button
                                                onClick={() =>
                                                    handlePlaceOrder(group.shopInfo, group.items)
                                                }
                                                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition"
                                            >
                                                Hacer pedido
                                            </button>
                                            <button
                                                onClick={() => removeShopItems(group.shopInfo.id)}
                                                className="w-full sm:w-auto rounded-xl border border-red-200 text-red-600 hover:bg-red-50 px-5 py-3 font-semibold shadow hover:shadow-md transition"
                                            >
                                                Botar pedido
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <footer className="py-5">
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="rounded-xl border border-red-200 text-red-600 hover:bg-red-50 px-4 py-3 font-semibold transition w-full sm:w-auto"
                        >
                            Vaciar carrito
                        </button>
                    )}
                </footer>
            </section>
        </main>
    );
};

export default ShoppingCart;
