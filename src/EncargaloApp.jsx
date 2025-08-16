//react
import { useState } from "react";

// components
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import ShopMenu from "./components/ShopMenu.jsx";
import FoodDashboard from "./components/FoodDashboard.jsx";

// Datos mock
import { ITEMS_DATA, SHOPS_DATA } from "../db.js";

const EncargaloApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);

  // Login simulado
  const handleLogin = async (loginData) => {
    setIsLoggingIn(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const phoneValid = loginData.phone.trim().length > 0;
      const passwordValid = loginData.password
        ? loginData.password.length >= 4
        : true;
      if (phoneValid && passwordValid) {
        setUser({ id: "1", name: "Usuario Demo", phone: loginData.phone });
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        alert("Verifica teléfono y contraseña");
      }
    } catch {
      alert("Error al iniciar sesión");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
  };

  // Favoritos
  const toggleFavorite = (shopId) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      newFav.has(shopId) ? newFav.delete(shopId) : newFav.add(shopId);
      return newFav;
    });
  };

  // Carrito
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-orange-400">
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        cartTotal={cartTotal}
        cart={cart}
      />
      {/*  {selectedShop ? (
        <ShopMenu
          shop={selectedShop}
          items={ITEMS_DATA}
          user={user}
          isLoggedIn={isLoggedIn}
          cart={cart}
          addToCart={addToCart}
          cartTotal={cartTotal}
          onBack={() => setSelectedShop(null)}
        />
      ) : (
        )} */}
      <FoodDashboard
        shops={SHOPS_DATA}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
      />
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        isLoading={isLoggingIn}
      />
    </div>
  );
};

export default EncargaloApp;
