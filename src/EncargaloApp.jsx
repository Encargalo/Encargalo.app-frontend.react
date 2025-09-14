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
import useCartStore from "./store/cartStore.js";
import RequestLocationModal from "./components/RequestLocationModal.jsx";

const EncargaloApp = () => {
  //favorites
  const [favorites, setFavorites] = useState(new Set());
  //navigate
  const navigate = useNavigate()
  //

  // Favoritos
  const toggleFavorite = (shopId) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      newFav.has(shopId) ? newFav.delete(shopId) : newFav.add(shopId);
      return newFav;
    });
  };

  //cart store
  const { cart } = useCartStore()

  useEffect(() => {
    getInformationCustomer()

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
        <RequestLocationModal />

        {/* cart */}
        <div className="fixed bottom-2 right-2 bg-orange-100 size-max rounded-md shadow-xl border border-orange-300 flex justify-center items-center p-3 w-max gap-x-3 sm:hidden"
          onClick={() => navigate("/shopping_cart")}
        >
          <ShoppingCartIcon className="text-orange-500 size-7" />
          {
            cart.length > 0 &&
            <span className="text-xl">{cart.length}</span>
          }
        </div>
      </div>
    </div>)
};

export default EncargaloApp;
