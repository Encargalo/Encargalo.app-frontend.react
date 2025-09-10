//icons
import { MapPin, User, LogOut, ChevronRight } from "lucide-react";
//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//utils
import { getDecryptedItem } from "../utils/encryptionUtilities";
//services
import getAddress from "../services/getAddress";
import UserMenu from "./UserMenu";
import useOnLoginStore from "../store/onLoginStore";
import ShoppingCartIcon from "./ShoppingCartIcon";

const Header = () => {
  const [userData, setUserData] = useState(null)
  const [address, setAddress] = useState(null);

  const navigate = useNavigate()

  //onLogin
  const { openLoginModal } = useOnLoginStore()

  //get user data
  useEffect(() => {
    const user_session = import.meta.env.VITE_USER_SESSION
    const user = getDecryptedItem(user_session)
    setUserData(user)
  }, [])


  //get address
  useEffect(() => {
    getAddress(setAddress);
  }, []);

  //navigate customer profile
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
          <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Encargalo
          </h1>

          {/* address */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {address && userData?.session &&
              <div div className="items-center hidden md:flex space-x-2">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
                <address className="text-xs sm:text-base text-gray-700 font-medium text-clip">
                  {address}
                </address>
              </div>
            }

            {/* Botones de autenticación */}
            {userData?.session ? (
              <UserMenu userData={userData} handleNavigate={handleNavigate} />
            ) : (
              <div className="flex gap-x-4">
                <ShoppingCartIcon />
                {/* login */}
                <button
                  onClick={openLoginModal}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:text-xl text-lg"
                >
                  Iniciar Sesión
                </button>

              </div>
            )}
          </div>
        </div>
      </section>
    </header >
  );
};

export default Header;
