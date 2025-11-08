//icions
import { X, Plus, Minus } from "lucide-react";
//react
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
//services
import getAdditionals from "../services/getAdditionals";
//store
import useCartStore from "../../cart/store/cartStore";
import getFlovors from "../services/getFlovors";

const FoodDetailsModal = ({ food, onClose }) => {
  const [additionals, setAdditionals] = useState([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [observation, setObservation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [flavors, setFlavors] = useState([]);
  const [selectFlavorsError, setSelectdFlavorsError] = useState("")

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

  const flavorRules = useMemo(() => {
    if (!food.rules || !Array.isArray(food.rules)) return {};
    const rule = food.rules.find((r) => r.rule_key === "max_flavors");
    return {
      maxFlavors: rule ? parseInt(rule.rule_value, 10) : 1,
      selectorType: rule ? rule.selector_type : "single_select",
    };
  }, [food.rules]);

  const totalSelectedFlavors = useMemo(() => {
    // Para multi_select, suma las cantidades. Para single_select, cuenta los items.
    return selectedFlavors.reduce((sum, f) => sum + (f.quantity || 1), 0);
  }, [selectedFlavors]);

  const { total, finalQuantity } = useMemo(() => {
    const additionalsPrice = selectedAdditionals.reduce((sum, a) => sum + (a.price || 0), 0);

    if (flavorRules.selectorType === 'multi_select') {
      // Para multi_select, la cantidad es el total de sabores y el precio se multiplica.
      const flavorsTotal = food.price * totalSelectedFlavors;
      // Los adicionales se suman al final, no se multiplican por cantidad de sabores.
      return { total: flavorsTotal + additionalsPrice, finalQuantity: totalSelectedFlavors };
    }

    // Para productos normales y single_select, se usa el contador de cantidad.
    const unitPrice = food.price + additionalsPrice;
    return { total: unitPrice * quantity, finalQuantity: quantity };

  }, [food.price, selectedAdditionals, totalSelectedFlavors, flavorRules.selectorType, quantity]);

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

  const handleFlavorQuantityChange = (flavor, change) => {
    setSelectedFlavors(prev => {
      const existingFlavor = prev.find(f => f.id === flavor.id);

      if (existingFlavor) {
        const newQuantity = existingFlavor.quantity + change;
        if (newQuantity > 0) {
          // Actualizar cantidad
          return prev.map(f => f.id === flavor.id ? { ...f, quantity: newQuantity } : f);
        } else {
          // Eliminar si la cantidad es 0
          return prev.filter(f => f.id !== flavor.id);
        }
      } else if (change > 0) {
        // Añadir nuevo sabor con cantidad 1
        return [...prev, { ...flavor, quantity: 1 }];
      }

      return prev; // No hacer nada si se intenta restar de un sabor no seleccionado
    });
  };

  const handleAddToCart = () => {
    // Validación para sabores si son obligatorios
    if (flavorRules.selectorType === 'multi_select' && totalSelectedFlavors === 0) {
      setSelectdFlavorsError(`Debes seleccionar al menos un sabor.`);
      return;
    }

    setSelectdFlavorsError(''); // Limpiar error si pasa la validación
    addItem({
      ...food,
      additionals: selectedAdditionals,
      flavors: selectedFlavors,
      observation: observation.trim(),
      quantity: finalQuantity,
      price: food.price,
      shopInfo: food.shop,
    });

    onClose();
  };

  const pathname = location.pathname
  const validateShopPath = pathname === "/";


  return (
    <dialog
      className="fixed w-full h-full inset-0 bg-black bg-opacity-50 flex z-50 sm:flex sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <aside className="bg-white w-full h-full flex flex-col sm:w-2/5 sm:h-[90vh] sm:max-h-[800px] sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header con imagen (solo móvil) y botón de cerrar */}
        <header className="relative shrink-0 ">
          {food.shop?.logo && (
            <figure
              onClick={() => navigate(`/${food.shop.tag}`)}
              className="absolute top-4 left-4 bg-white rounded-full p-1 transition-all duration-300 z-10 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 sm:hidden"
            >
              <img src={food.shop.logo} alt={`Logo de ${food.shop.name}`} className="size-10 sm:size-12 object-cover rounded-full" />
            </figure>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 z-10"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
          <img src={food.image} alt={food.name} className="w-full aspect-video object-cover sm:hidden" />
        </header>

        {/* Header Fijo con Nombre y Precio */}
        <div className="shrink-0 p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-y-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{food.name}</h2>
              {flavorRules.selectorType === 'multi_select' && (
                <span className="text-xl font-semibold text-gray-500 mt-1">
                  ${food.price.toLocaleString()} c/u
                </span>
              )}
            </div>
            {flavorRules.selectorType !== 'multi_select' && (
              <h4 className="text-3xl font-extrabold text-orange-600">
                ${total.toLocaleString()}
              </h4>
            )}
          </div>
        </div>

        {/* Contenido Principal (Scrollable) */}
        <section className="flex-1 overflow-y-scroll p-6">
          <img src={food.image} alt={food.name} className="w-full aspect-video rounded-xl mb-4 hidden sm:block object-cover" />
          <p className="text-lg text-gray-600 mt-1">{food.description}</p>

          {/* observaciones */}
          {flavorRules.selectorType !== 'multi_select' && (
            <div className="mt-4">
              <label className="block text-gray-950 mb-2 sm:text-xl text-lg">Observaciones</label>
              <textarea
                className="w-full border border-gray-400 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-orange-400"
                rows="2"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
          )}

          {/* sabores */}
          {food.has_flavors && flavors.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Sabores
                </h3>
              </div>
              {selectFlavorsError && (
                <p className="text-red-600 my-2">{selectFlavorsError}</p>
              )}
              <div className="flex flex-col gap-2">
                {flavorRules.selectorType === 'multi_select'
                  ? flavors.map((flavor) => {
                    const selected = selectedFlavors.find(f => f.id === flavor.id);
                    const currentQty = selected ? selected.quantity : 0;
                    return (
                      <div key={flavor.id} className="w-full flex justify-between items-center border rounded-lg px-4 py-2 text-base sm:text-lg bg-orange-50 border-orange-200">
                        <span className="text-left">{flavor.name}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleFlavorQuantityChange(flavor, -1)} disabled={currentQty === 0} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full disabled:opacity-50">
                            <Minus className="size-4" />
                          </button>
                          <span className="text-xl font-bold w-6 text-center">{currentQty}</span>
                          <button onClick={() => handleFlavorQuantityChange(flavor, 1)} disabled={totalSelectedFlavors >= flavorRules.maxFlavors} className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full disabled:opacity-50">
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                  : flavors.map((flavor) => (
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
                    </button>
                  ))
                }
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

        </section>

        {/* Footer Fijo con Contador y Botón */}
        <footer className="shrink-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center w-full gap-4">
            {/* Contador de Cantidad (si aplica) */}
            {flavorRules.selectorType !== 'multi_select' ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
                  <Minus className="size-5" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Muestra el total de sabores para multi_select
              <div className="flex flex-col">
                <span className="text-gray-600 text-lg">Total</span>
                <span className="text-2xl font-extrabold text-orange-600">
                  ${(food.price * totalSelectedFlavors).toLocaleString()}
                </span>
              </div>
            )}

            {/* Botón de Agregar */}
            <button onClick={handleAddToCart} className="flex-1 sm:flex-none sm:w-64 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
              Agregar
            </button>
          </div>
        </footer>
      </aside>
    </dialog>
  );
};

export default FoodDetailsModal;
