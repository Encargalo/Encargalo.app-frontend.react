//react
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ilustrations } from "../assets/ilustrations";
//store/hooks
import useCartStore from "../store/cartStore";
import usePlaceOrderStore from "../store/placeOrderStore";
import useNumberFormat from "../hooks/useNumberFormat";
//lib
import { preprocessCartItems } from "../lib/cartUtils";
//assets (opcional: si tienes ilustraciones)

const ShoppingCart = () => {
    const navigate = useNavigate();
    const { cart = [], addItem, removeItemQuantity, clearCart } = useCartStore();
    const { setPlaceOrder } = usePlaceOrderStore();
    const { formatNumber } = useNumberFormat();

    const processed = useMemo(() => preprocessCartItems(cart), [cart]);

    const groupedByShop = useMemo(() => {
        return processed.reduce((acc, item) => {
            const shopId = item?.shopInfo?.id ?? "sin-tienda";
            if (!acc[shopId]) {
                acc[shopId] = {
                    shopId,
                    shopName: item?.shopInfo?.name ?? "Sin tienda",
                    items: [],
                };
            }
            acc[shopId].items.push(item);
            return acc;
        }, {});
    }, [processed]);

    const handlePlaceOrder = (shopId, shopName, items) => {
        setPlaceOrder({ shopId, shopName, items });
        navigate("/cart/checkout");
    };

    const isEmpty = cart.length === 0;

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100">
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                    <div className="mb-3 sm:mb-0">
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            Tu carrito
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Revisa tus productos por tienda y confirma tu pedido.
                        </p>
                    </div>

                    <div className="sm:space-x-3 space-y-3">

                        <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition" onClick={() => navigate(-1)}>
                            Volver al menú
                        </button>
                        {!isEmpty && (
                            <button
                                onClick={clearCart}
                                className="rounded-xl border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 font-semibold transition w-full sm:w-auto"
                            >
                                Vaciar carrito
                            </button>
                        )}
                    </div>

                </header>

                {isEmpty ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 sm:p-12 text-center">
                        {ilustrations.fastFood1 ? (
                            <img
                                src={ilustrations.fastFood1}
                                alt="Carrito vacío"
                                className="mx-auto w-48 sm:w-60 mb-6"
                            />
                        ) : (
                            <div className="text-6xl mb-4">🛒</div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tu carrito está vacío
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Agrega productos de tus restaurantes favoritos.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition"
                        >
                            Seguir comprando
                        </button>
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
                                    key={group.shopId}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm"
                                >
                                    {/* Header tienda */}
                                    <div className="flex items-center justify-between px-5 pt-5 border-b border-gray-100">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                                {group.shopName}
                                            </h3>
                                            <p className="sm:text-xl text-gray-500">
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
                                    <ul className="divide-y divide-gray-200 px-3">
                                        {group.items.map((item, idx) => (
                                            <li
                                                key={`${item.id}-${idx}`}
                                                className="p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                                            >
                                                {/* detalle */}
                                                <div className="flex gap-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="size-20 sm:size-24 rounded-xl object-cover border border-gray-200"
                                                    />
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg sm:text-2xl font-semibold text-gray-800">
                                                            {item.name}
                                                        </h4>
                                                        {item.description && (
                                                            <p className="sm:text-xl text-gray-600">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.additionals?.length > 0 && (
                                                            <div className="text-sm sm:text-lg text-gray-700">
                                                                <span className="font-semibold">
                                                                    Adicionales:
                                                                </span>{" "}
                                                                {item.additionals
                                                                    .map((a) => a.name)
                                                                    .join(", ")}
                                                            </div>
                                                        )}
                                                        {item.observation && (
                                                            <p className="text-sm sm:text-lg text-gray-600 italic">
                                                                Obs.: {item.observation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* precio / cantidad / acciones */}
                                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                                                    <div className="text-right">
                                                        <p className="sm:text-base text-gray-500">
                                                            Unitario
                                                        </p>
                                                        <p className="font-semibold text-xl">
                                                            ${formatNumber(item.price, "es-CO")}
                                                        </p>
                                                        <p className="sm:text-base text-gray-500 mt-1">
                                                            Subtotal
                                                        </p>
                                                        <p className="sm:text-base font-extrabold text-gray-900">
                                                            ${formatNumber(item.subtotal, "es-CO")}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                removeItemQuantity(item)
                                                            }
                                                            className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-semibold"
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
                                                            className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100 font-semibold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* acciones tienda */}
                                    <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <div className="text-gray-600">
                                            ¿Listo para pedir en{" "}
                                            <span className="font-semibold sm:text-lg">{group.shopName}</span>?
                                        </div>
                                        <button
                                            onClick={() =>
                                                handlePlaceOrder(
                                                    group.shopId,
                                                    group.shopName,
                                                    group.items
                                                )
                                            }
                                            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition"
                                        >
                                            Hacer pedido
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ShoppingCart;
