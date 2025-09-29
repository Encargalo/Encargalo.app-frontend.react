//icions
import { X, Plus, Minus } from "lucide-react";
//react
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
//services
import getAdditionals from "../services/getAdditionals";
//store
import useCartStore from "../store/cartStore";
import getFlovors from "../services/getFlovors";

const FoodDetailsModal = ({ food, onClose }) => {
  const [additionals, setAdditionals] = useState([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [observation, setObservation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [flavors, setFlavors] = useState([]);

  console.log(food)


  const { addItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (food.category_id) {
      getAdditionals(setAdditionals, food.category_id);
    }
    if (food.has_flavors) {
      getFlovors(setFlavors, food.id);
    }
  }, [food.id, food.category_id, food.has_flavors]);

  // bloquear scroll body cuando la modal está abierta
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Cerrar modal en móvil al retroceder y en PC al presionar Escape
  useEffect(() => {
    // Handler para Escape
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Handler para retroceder en móvil
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);

  const unitPrice =
    food.price + selectedAdditionals.reduce((sum, a) => sum + (a.price || 0), 0);
  const total = unitPrice * quantity;

  const flavorRules = useMemo(() => {
    if (!food.rules || !Array.isArray(food.rules)) return {};
    const rule = food.rules.find((r) => r.rule_key === "max_flavors");
    return {
      maxFlavors: rule ? parseInt(rule.rule_value, 10) : 1,
      selectorType: rule ? rule.selector_type : "single_select",
    };
  }, [food.rules]);

  const handleFlavorClick = (flavor) => {
    setSelectedFlavors((prev) => {
      const isSelected = prev.find((f) => f.id === flavor.id);

      // Lógica para single_select (pizzas, etc.)
      if (flavorRules.selectorType === "single_select") {
        if (isSelected) {
          // Si ya está seleccionado, lo quita
          return prev.filter((f) => f.id !== flavor.id);
        } else {
          // Si no está seleccionado, y no hemos alcanzado el límite, lo añade
          if (prev.length < flavorRules.maxFlavors) {
            return [...prev, flavor];
          }
        }
      }

      return prev; // Mantener el estado si no se cumple ninguna condición
    });
  };

  const handleAddToCart = () => {
    // Validación para sabores si son obligatorios
    if (food.has_flavors && flavorRules.maxFlavors > 0 && selectedFlavors.length === 0) {
      alert(`Debes seleccionar al menos un sabor.`);
      return;
    }
    addItem({
      ...food,
      additionals: selectedAdditionals,
      flavors: selectedFlavors,
      observation: observation.trim(),
      quantity,
      price: food.price,
      shopInfo: food.shop,
    });

    onClose();
  };

  const pathname = location.pathname
  const validateShopPath = pathname === "/"


  return (
    <dialog
      className="fixed w-full h-full inset-0 bg-black bg-opacity-50 flex z-50 sm:flex sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <aside
        className="bg-white w-full h-full flex flex-col sm:w-2/5 sm:h-3/4 sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <header className="relative shrink-0 ">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-64 object-cover sm:rounded-t-xl"
          />

          {/* logo */}
          {
            validateShopPath ?
              <div className="absolute top-4 left-4" onClick={() => navigate(`/${food.shop.tag}`)}>
                <img src={food.shop.logo_image} alt={food.shop.logo_image} className="size-16 object-cover rounded-full border-2 border-orange-200 hover:border-orange-500 cursor-pointer transition-colors" />

              </div>
              : null
          }
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hidden sm:inline-block"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </header>

        {/* details */}
        <section className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center flex-wrap mb-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h2>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-orange-600">
              ${total.toLocaleString()}
            </h4>
          </div>
          <p className="text-lg text-gray-600 mt-1">{food.description}</p>

          {/* cantidad */}
          <div className="mt-6 flex items-center space-x-4">
            <p className="text-lg sm:text-xl font-semibold">Cantidad</p>
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
            >
              <Minus className="size-5" />
            </button>
            <span className="text-xl font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* observaciones */}
          <div className="mt-4">
            <label className="block text-gray-950 mb-2 sm:text-xl text-lg">Observaciones</label>
            <textarea
              className="w-full border border-gray-400 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-orange-400"
              rows="2"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          {/* sabores */}
          {food.has_flavors && flavors.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Sabores
                  <span className="text-base font-normal text-gray-600 ml-2">
                    (Elige hasta {flavorRules.maxFlavors})
                  </span>
                </h3>
                {selectedFlavors.length > 0 && (
                  <button
                    onClick={() => setSelectedFlavors([])}
                    className="text-sm text-orange-600 hover:text-orange-800 font-semibold px-2 py-1 rounded-md hover:bg-orange-100 transition-colors"
                  >
                    Quitar selección
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => handleFlavorClick(flavor)}
                    disabled={
                      selectedFlavors.length >= flavorRules.maxFlavors &&
                      !selectedFlavors.find((f) => f.id === flavor.id)
                    }
                    className={`w-full flex justify-between items-center border rounded-lg px-4 py-3 text-base sm:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${selectedFlavors.find((f) => f.id === flavor.id)
                      ? "bg-orange-500 text-white border-orange-600 shadow-md"
                      : "bg-orange-50 hover:bg-orange-100 border-orange-200"
                      }`}
                  >
                    <span className="text-left">{flavor.name}</span>
                    {/* El precio de los sabores no se suma, es para elegir */}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* adicionales */}
          {
            additionals.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Adicionales</h3>
                <div className="flex flex-col gap-2">
                  {additionals.map((a) => (
                    <button
                      key={a.id}
                      onClick={() =>
                        setSelectedAdditionals((prev) =>
                          prev.find((x) => x.id === a.id)
                            ? prev.filter((x) => x.id !== a.id) // Deseleccionar
                            : [...prev, a] // Seleccionar
                        )
                      }
                      className={`w-full flex justify-between items-center border rounded-lg px-4 py-3 text-base sm:text-lg transition-all duration-200 ${selectedAdditionals.find((x) => x.id === a.id)
                        ? "bg-orange-500 text-white border-orange-600 shadow-md"
                        : "bg-orange-50 hover:bg-orange-100 border-orange-200"
                        }`}
                    >
                      <span className="text-left">{a.name}</span>
                      <span className="font-semibold">+${a.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
              : null
          }


          {/* footer */}
          <footer className="shrink-0 flex flex-col items-center mt-5 gap-5">
            <div className="flex justify-between sm:justify-end w-full gap-2">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors inline-block sm:hidden"
              >
                Cerrar
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Agregar al Carrito
              </button>
            </div>
          </footer>
        </section>
      </aside>
    </dialog>
  );
};

export default FoodDetailsModal;
