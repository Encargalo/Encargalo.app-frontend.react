//icons
import { ShoppingCartIcon } from "lucide-react"
//react
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import Header from "./components/Header";
const FoodDashboard = lazy(() => import('./components/FoodDashboard.jsx'))
import Loader from "./components/Loader.jsx";
import WelcomeCustomerModal from "./components/WelcomeCustomerModal.jsx";
import SessionModal from "./components/SessionCustomer/SessionModal.jsx";
//utils
import useLoaderStore from "./store/loaderStore.js";
//services
import getInformationCustomer from "./services/getInformationCustomer.js";
import { getDecryptedItem } from "./utils/encryptionUtilities.js";

const EncargaloApp = () => {
  //favorites
  const [favorites, setFavorites] = useState(new Set());
  //cart
  const [cart, setCart] = useState([]);
  //navigate
  const navigate = useNavigate()


  // Favoritos
  const toggleFavorite = (shopId) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      newFav.has(shopId) ? newFav.delete(shopId) : newFav.add(shopId);
      return newFav;
    });
  };

  useEffect(() => {
    getInformationCustomer()

    const cart_key = import.meta.env.VITE_CART_STORAGE_KEY
    const cartData = getDecryptedItem(cart_key)
    if (cartData) {
      setCart(cartData)
    }
  }, []);

  const { isLoading } = useLoaderStore();

  return (
    <div>
      {isLoading && (
        <Loader />
      )}
      <div className="min-h-dvh w-dvw relative background">
        <Header
        />
        <Suspense fallback={<Loader />}>
          <FoodDashboard
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </Suspense>

        {/* modals */}
        <SessionModal />
        <WelcomeCustomerModal />

        <button className="fixed bottom-3 right-3 p-4 bg-orange-100 size-max rounded-md shadow-xl border border-orange-300 sm:hidden"
          onClick={() => navigate("/shopping_cart")}
        >
          <ShoppingCartIcon className="text-orange-500" />
          <span>{cart?.length}</span>
        </button>
      </div>
    </div>)
};

export default EncargaloApp;
