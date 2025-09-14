import { useState, useEffect } from "react";

//lottie animations
import Lottie from "lottie-react";
import animation_delivery_on_a_bike from "../assets/animations/animation_delivery_on _a_bike.json";

const loadingTexts = [
  "¿Qué vamos a comer hoy?",
  "Buscando los mejores restaurantes...",
  "Cargando el menú que te antoja...",
  "Un momento, estamos preparando tu pedido...",
  "Buscando las mejores ofertas para ti...",
  "Casi listo para que hagas tu pedido.",
  "La comida que te encanta, a un clic.",
  "Preparando la experiencia más deliciosa.",
  "Un repartidor está esperando tu orden.",
  "Desde la cocina a tu puerta.",
  "Tu próxima comida está en camino.",
];

const Loader = () => {
  //ramdom text
  const getRandomText = () =>
    loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
  const [loadingText, setLoadingText] = useState(getRandomText());
  //animation text
  const [animationClass, setAnimationClass] = useState("animate-fade-in-right");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass("animate-fade-out-right");
      setTimeout(() => {
        setLoadingText(getRandomText());
        setAnimationClass("animate-fade-in-right");
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-orange-100 w-screen h-full flex items-center flex-col p-5 justify-center top-0 fixed inset-0 z-[9999] pointer-events-auto">
      <div className="w-full flex justify-center items-center">
        <Lottie
          animationData={animation_delivery_on_a_bike}
          loop={true}
          autoplay={true} style={{
            width: "35em",
            minWidth: '20em',
          }}
        />

      </div>
      <h1
        key={loadingText}
        className={`text-2xl font-medium text-gray-700 text-center ${animationClass}
          sm:text-3xl lg:text-4xl h-4 flex
        `}
        style={{
          animationIterationCount: 1,
        }}
      >
        {loadingText}
      </h1>
    </div>
  );
};

export default Loader;
