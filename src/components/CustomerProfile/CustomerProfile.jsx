import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { getDecryptedItem } from "../../utils/encryptionUtilities"
import getInformationCustomer from "../../services/getInformationCustomer"
import { ChevronDown, User, MapPin, Lock, ArrowLeft } from "lucide-react"

const CustomerProfile = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const user_session = import.meta.env.VITE_USER_SESSION;
    const user_data = getDecryptedItem(user_session)
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        getInformationCustomer()

        if (!user_data?.session) {
            navigate("/")
        }
    }, [navigate, user_data?.session])

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

    const { pathname } = location;

    const pathsname = {
        index: "/customer_profile",
        personalData: "/customer_profile/personal_data",
        address: "/customer_profile/address",
        updatePassword: "/customer_profile/update_password"
    }

    const navItems = [
        {
            label: "Perfil",
            path: "/customer_profile/personal_data",
            icon: User,
            activePaths: [pathsname.index, pathsname.personalData]
        },
        {
            label: "Mis ubicaciones",
            path: "/customer_profile/address",
            icon: MapPin,
            activePaths: [pathsname.address]
        },
        {
            label: "Cambiar contraseña",
            path: "/customer_profile/update_password",
            icon: Lock,
            activePaths: [pathsname.updatePassword]
        }
    ];

    const handleNavigate = (path) => {
        if (path === "/customer_profile/personal_data") {
            getInformationCustomer();
        }
        navigate(path, { replace: true });
        setIsOpen(false);
    };

    const activeItem = navItems.find(item => item.activePaths.includes(pathname));
    const activeLabel = activeItem ? activeItem.label : "Menú";

    if (!user_data?.session) return null

    return (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 min-h-dvh w-full">
            {/* Mobile Header */}
            <header ref={menuRef} className="sm:hidden sticky top-0 bg-white shadow-md z-20 p-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-orange-600 font-semibold p-2 rounded-lg hover:bg-orange-50">
                    <ArrowLeft className="size-5" />
                    <span>Volver</span>
                </button>

                <div className="relative">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 font-medium text-gray-700 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200">
                        <span>{activeLabel}</span>
                        <ChevronDown className={`size-5 text-orange-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                        <nav className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-30">
                            <ul className="flex flex-col gap-y-1">
                                {navItems.map((item) => (
                                    <li
                                        key={item.path}
                                        onClick={() => handleNavigate(item.path)}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition cursor-pointer font-medium text-gray-700"
                                    >
                                        <item.icon className="size-5 text-orange-600" />
                                        <span>{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </header>

            <main className="w-full relative p-4 lg:p-12 flex flex-col lg:flex-row-reverse sm:justify-end gap-y-3 lg:gap-7">
                {/* Desktop Sidebar */}
                <header className="h-max w-full lg:w-1/2 hidden sm:block">
                    <nav className="bg-white border border-gray-300 rounded-2xl p-5">
                        <div className="space-y-3 mb-6 hidden lg:flex lg:flex-col">
                            <h2 className="text-3xl"><span className="text-orange-600">Hola {user_data?.data.name},</span> Aqui puedes actualizar tus datos</h2>
                            <p className="text-xl text-gray-600">
                                Actualiza tu datos personales, contraseñas y añade nuevas direcciones
                            </p>
                        </div>
                        <ul className="w-full flex flex-col gap-y-2">
                            {navItems.map(item => (
                                <li
                                    key={item.path}
                                    className={`${item.activePaths.includes(pathname) ? "bg-orange-400 hover:bg-orange-500 text-white border border-orange-700" : "text-orange-600 hover:bg-orange-500 hover:text-white"} px-4 py-2 rounded-md cursor-pointer text-base sm:text-xl transition-colors`}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    <p>{item.label}</p>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="p-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60 sm:text-xl"
                        >
                            Volver
                        </button>
                    </div>
                </header>

                {/* Outlet Section */}
                <section className="h-max w-full sm:w-11/12 bg-white border border-gray-300 rounded-2xl shadow-md">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default CustomerProfile