//react
import { useEffect, useRef, useState } from "react";
//icons
import { ChevronDown, ChevronRight, LogOut, ShoppingCart, User } from "lucide-react";
//services
import { useNavigate } from "react-router-dom";
import logOutCustomer from "../features/auth/services/logOutCustomer";
import { getDecryptedItem } from "../utils/encryptionUtilities";
import ShoppingCartIcon from "./Icons/ShoppingCartIcon";

const UserMenu = () => {
    const [userData, setUserData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const user_session = import.meta.env.VITE_USER_SESSION
        const user = getDecryptedItem(user_session)
        setUserData(user)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* PC (inline) */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
                <ShoppingCartIcon />

                <figure
                    className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-3 sm:px-3 py-2 sm:py-2 rounded-xl border border-orange-300 group cursor-pointer"
                    onClick={() => navigate("/customer_profile")}
                >
                    <User className="size-4 sm:size-6 text-orange-600" />
                    <p className="text-sm sm:text-base font-medium text-gray-700">
                        {userData?.data?.name}
                    </p>
                    <ChevronRight className="size-4 sm:size-5 text-orange-600 transition-transform duration-200 transform group-active:translate-x-2" />
                </figure>

                {/* logout */}
                <button
                    className="flex items-center space-x-1 sm:space-x-2 hover:text-orange-600 px-2 sm:px-3 py-2 rounded-xl hover:bg-orange-50 hover:border-orange-500 transition-all duration-300"
                    onClick={logOutCustomer}
                >
                    <LogOut className="size-4 sm:size-5 text-orange-600" />
                    <span className="text-sm sm:text-lg font-medium">Salir</span>
                </button>
            </div>

            {/* Mobile (dropdown) */}
            <div className="flex sm:hidden items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200"
                >
                    <User className="size-5 text-orange-600" />
                    <span className="font-medium text-gray-700">
                        {userData?.data?.name}
                    </span>
                    <ChevronDown
                        className={`size-4 text-orange-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* Dropdown content */}
                {isOpen && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-40 p-2 z-40">

                        {/* perfil */}
                        <button
                            onClick={() => navigate("/customer_profile")}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                        >
                            <User className="size-5 text-orange-600" />
                            <span className="font-medium text-gray-700">Perfil</span>
                        </button>

                        {/* shopping cart */}
                        <button
                            onClick={() => navigate("/shopping_cart")}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                        >
                            <ShoppingCart className="size-5 text-orange-600" />
                            <span className="font-medium text-gray-700">Carrito</span>
                        </button>

                        {/* logout */}
                        <button
                            onClick={logOutCustomer}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                        >
                            <LogOut className="size-5 text-orange-600" />
                            <span className="font-medium">Salir</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;