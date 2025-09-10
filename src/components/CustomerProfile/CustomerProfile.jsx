import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getDecryptedItem } from "../../utils/encryptionUtilities"
import getInformationCustomer from "../../services/getInformationCustomer"
import { LogOut } from "lucide-react"

const CustomerProfile = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        getInformationCustomer()
        const user_session = import.meta.env.VITE_USER_SESSION;
        const data = getDecryptedItem(user_session)

        if (!data?.session) {
            navigate("/")
            return;
        }
        setUser(data)
    }, [navigate])

    const { pathname } = location;

    const pathsname = {
        index: "/customer_profile",
        personalData: "/customer_profile/personal_data",
        address: "/customer_profile/address",
        updatePassword: "/customer_profile/update_password"
    }

    if (!user?.session) return

    return (
        <main className="min-h-dvh w-full relative p-4 sm:p-12 flex flex-col gap-y-3 lg:flex-row-reverse sm:justify-end bg-gradient-to-br from-orange-50 to-orange-100 gap-7">

            {/* header */}
            <header className="h-max w-full lg:w-1/2">
                <nav className="bg-white border border-gray-300 rounded-2xl p-5">
                    {/* header */}
                    <div className="space-y-3 mb-6 hidden lg:flex lg:flex-col">
                        <h2 className="text-3xl"><span className="text-orange-600">Hola {user && user.data.name},</span> Aqui puedes actualizar tus datos</h2>
                        <p className="text-xl text-gray-600">
                            Actualiza tu datos personales, contraseñas y añade nuevas direcciones
                        </p>
                    </div>

                    {/* links list */}
                    <ul className="w-full flex flex-col gap-y-2">
                        {/* ${pathname === pathsname.index || pathname === pathsname.personalData */}
                        <li
                            className={`${pathname === pathsname.index || pathname === pathsname.personalData ? "bg-orange-400 hover:bg-orange-500 text-white border border-orange-700" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-base sm:text-xl transition-colors
                            `}

                            onClick={() => {
                                getInformationCustomer()
                                navigate("/customer_profile/personal_data")
                            }}
                        >
                            <p>
                                Perfil
                            </p>
                        </li>
                        <li
                            className={`${pathname === pathsname.address ? "bg-orange-400 hover:bg-orange-500 text-white border border-orange-700" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-base sm:text-xl transition-colors"
                            `}

                            onClick={() => { navigate("/customer_profile/address") }}
                        >
                            <p>
                                Mis ubicaciónes
                            </p>
                        </li>
                        <li
                            className={`${pathname === pathsname.updatePassword ? "bg-orange-400 hover:bg-orange-500 text-white border border-orange-700" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-base sm:text-xl transition-colors
                            `}

                            onClick={() => { navigate("/customer_profile/update_password") }}
                        >
                            <p>
                                Cambiar contraseña
                            </p>
                        </li>
                    </ul>
                </nav>

                {/* return page */}
                <div className="p-5">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60 sm:text-xl"
                    >
                        Volver al menú
                    </button>

                </div>
            </header>

            {/* container */}
            <section className="h-max w-full sm:w-11/12 bg-white border border-gray-300 rounded-2xl shadow-md">
                {/* personal info */}
                <Outlet />
            </section>
        </main>
    )
}

export default CustomerProfile