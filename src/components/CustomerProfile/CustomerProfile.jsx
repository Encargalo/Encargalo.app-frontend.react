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
        <main className="min-h-screen w-dvh relative background p-4 sm:p-12 flex flex-col gap-y-3 lg:flex-row-reverse sm:justify-end">

            {/* header */}
            <header className="h-max w-full lg:w-1/2 shadow-lg p-5 bg-orange-50 lg:ml-14 rounded-md">
                <nav>

                    {/* header */}
                    <div className="space-y-3 mb-6 hidden lg:flex lg:flex-col">
                        <h2 className="text-3xl">Hola {user && user.data.name}, Aqui puedes actualizar tus datos</h2>
                        <p className="text-xl text-gray-600">
                            Actualiza tu datos personales, contraseñas y añade nuevas direcciones
                        </p>
                    </div>

                    {/* links list */}
                    <ul className="w-full grid items-center grid-cols-2 sm:grid-cols-1 gap-2">
                        {/* ${pathname === pathsname.index || pathname === pathsname.personalData */}
                        <li
                            className={`${pathname === pathsname.index || pathname === pathsname.personalData ? "bg-orange-400 hover:bg-orange-500 text-white" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-sm sm:text-xl transition-colors
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
                            className={`${pathname === pathsname.address ? "bg-orange-400 hover:bg-orange-500 text-white" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-sm sm:text-xl transition-colors
                            `}

                            onClick={() => { navigate("/customer_profile/address") }}
                        >
                            <p>
                                Mis ubicaciónes
                            </p>
                        </li>
                        <li
                            className={`${pathname === pathsname.updatePassword ? "bg-orange-400 hover:bg-orange-500 text-white" : "text-orange-600 hover:bg-orange-500 hover:text-white"}
                            px-4 py-2 rounded-md cursor-pointer text-sm sm:text-xl transition-colors
                            `}

                            onClick={() => { navigate("/customer_profile/update_password") }}
                        >
                            <p>
                                Cambiar contraseña
                            </p>
                        </li>

                        <li className="w-full lg:mt-auto ml-auto">
                            <button
                                className="flex items-center space-x-1 sm:space-x-2 hover:text-orange-600 px-2 sm:px-3 py-2 sm:py-2 rounded-md hover:bg-orange-50 hover:border-orange-500 transition-all duration-300 w-full"
                                onClick={() => navigate("/")}

                            >
                                <LogOut className="size-4 sm:size-6 text-orange-600" />
                                <span className="text-sm sm:text-xl font-medium">Volver al menú</span>
                            </button>
                        </li>

                    </ul>
                </nav>
            </header>

            {/* container */}
            <section className="h-max w-full sm:w-11/12 bg-orange-50 rounded-md shadow-md">
                {/* personal info */}
                <Outlet />
            </section>
        </main>
    )
}

export default CustomerProfile