//icons
import { MapPin, User, LogOut, ChevronRight } from "lucide-react";
//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//utils
import { getDecryptedItem } from "../utils/encryptionUtilities";
//services
import logOutCustomer from "../services/logOutCustomer";

const Header = ({ onLogin, addressHeader }) => {
  const [userData, setUserData] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const user_session = 'user_session';
    const user = getDecryptedItem(user_session)
    setUserData(user)

  }, [])

  console.log(addressHeader)

  const handleNavigate = () => {
    navigate("/customer_profile")
  }


  return (
    /* header */
    <header className="bg-white shadow-lg sticky top-0 z-30 border-b border-gray-200">
      {/* titlte */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-4">
        <div className="flex items-center justify-between">
          {/* title */}
          <h1 className="text-xl sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            EncargaloApp
          </h1>

          {/* address */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* address info*/}
            <div className="items-center hidden md:flex space-x-2">
              {/* address icon */}
              {
                addressHeader &&
                <>
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
                  <address className="text-xs sm:text-xl text-gray-700 font-medium text-clip">
                    {addressHeader[0].address.split(' ').slice(0, 3).join(' ')}
                  </address>
                </>
              }
            </div>

            {/* Botones de autenticación */}
            {userData?.session ? (
              /* user info */
              <div className="flex items-center space-x-2 sm:space-x-3">
                <figure className="flex items-center space-x-1 sm:space-x-2 bg-orange-50 px-3 sm:px-3 py-2 sm:py-2 rounded-xl border border-orange-200 group cursor-pointer"
                  onClick={handleNavigate}
                >
                  <User className="size-4 sm:size-7 text-orange-600" />
                  <p className="text-sm sm:text-xl font-medium text-gray-700">
                    {userData.data.name}
                  </p>
                  <ChevronRight className="size-4 sm:size-6 text-orange-600 transition-transform duration-200 transform group-active:translate-x-2" />
                </figure>

                {/* logout */}
                <button
                  className="flex items-center space-x-1 sm:space-x-2 hover:text-orange-600 px-2 sm:px-3 py-2 sm:py-2 rounded-xl hover:bg-orange-50 hover:border-orange-500 transition-all duration-300"

                  onClick={logOutCustomer}
                >
                  <LogOut className="size-4 sm:size-6 text-orange-600" />
                  <span className="text-sm sm:text-xl font-medium">Salir</span>
                </button>
              </div>
            ) : (
              /* login */
              <button
                onClick={onLogin}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-xl sm:text-2xl"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
