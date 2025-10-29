//react
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
//store
import useCartStore from '../../features/cart/store/cartStore';
//icons
import { ChevronRight, ShoppingCart } from 'lucide-react'

const ShoppingCartIcon = () => {
    const [cartTotalItems, setCartTotalItems] = useState([]);

    const navigate = useNavigate()
    const { cart } = useCartStore();
    // Sumar la cantidad total de productos en el carrito
    const totalItems = Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + item.quantity, 0)
        : 0;

    const cart_clenear = 0;

    useEffect(() => {
        setCartTotalItems(totalItems);
    }, [totalItems]);

    return (
        <div onClick={() => navigate('/shopping_cart')} className="items-center gap-1 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200 group cursor-pointer hidden sm:flex">
            <ShoppingCart className="size-5 sm:size-6 text-orange-600" />
            {cartTotalItems !== cart_clenear ? (
                <span className="text-lg sm:text-lg text-gray-700 ml-1">
                    {cartTotalItems}
                </span>
            ) : <span className="text-base sm:text-lg text-gray-700 font-medium text-clip ml-1">Carrito</span>}
            <ChevronRight className="size-5 text-orange-600 transition-transform duration-200 transform group-active:translate-x-2" />
        </div>
    )
}

export default ShoppingCartIcon