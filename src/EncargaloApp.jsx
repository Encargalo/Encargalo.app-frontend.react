//react
import { lazy, Suspense, useEffect, useState } from "react";

// components
import Header from "./components/Header";
const FoodDashboard = lazy(() => import('./components/FoodDashboard.jsx'))
import Loader from "./components/Loader.jsx";
import WelcomeCustomerModal from "./components/WelcomeCustomerModal.jsx";
//utils
import useLoaderStore from "./store/loaderStore.js";
//services
import getInformationCustomer from "./services/getInformationCustomer.js";
import SessionModal from "./components/SessionCustomer/SessionModal.jsx";
import getAddressCustomer from "./services/getAddressCustomer.js";

const EncargaloApp = () => {
  //show login
  const [showLogin, setShowLogin] = useState(false);
  //show welcome 
  const [showWelcome, setShowWelcome] = useState(false)
  //favorites
  const [favorites, setFavorites] = useState(new Set());
  //validate addresss
  const [address, setAddress] = useState(false);

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
  }, []);

  const { isLoading } = useLoaderStore();

  return (
    <div>
      {isLoading && (
        <Loader />
      )}
      <div className="min-h-screen w-full relative background">
        <Header
          onLogin={() => setShowLogin(true)}
        />
        <Suspense fallback={<Loader />}>
          <FoodDashboard
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </Suspense>

        <SessionModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onOpenWelcome={() => setShowWelcome(true)}
          setAddress={setAddress}
        />

        <WelcomeCustomerModal
          show={showWelcome}
          onClose={() => setShowWelcome(false)}
          address={address}
        />

      </div>
    </div>)
};

export default EncargaloApp;
