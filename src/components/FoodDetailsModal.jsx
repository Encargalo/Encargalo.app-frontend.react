//icions
import { X, Plus, Minus } from "lucide-react";
//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//services
import getAdditionals from "../services/getAdditionals";
//store
import useCartStore from "../store/cartStore";

const FoodDetailsModal = ({ combo, onClose }) => {
  const [additionals, setAdditionals] = useState([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState([]);
  const [observation, setObservation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loaderAddtionals, setLoaderAdditionals] = useState(false)

  const { addItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAdditionals(setAdditionals, setLoaderAdditionals, combo.category_id);
  }, [combo.id]);

  // bloquear scroll body cuando la modal está abierta
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const unitPrice =
    combo.price + selectedAdditionals.reduce((sum, a) => sum + (a.price || 0), 0);
  const total = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      ...combo,
      additionals: selectedAdditionals,
      observation: observation.trim(),
      quantity,
      price: combo.price,
      shopInfo: combo.shop,
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
        className="bg-white w-full h-full flex flex-col sm:w-1/3 sm:h-max sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <header className="relative shrink-0 ">
          <img
            src={combo.image}
            alt={combo.name}
            className="w-full h-64 object-cover sm:rounded-t-xl"
          />

          {/* logo */}
          {
            validateShopPath ?
              <div className="absolute top-4 left-4" onClick={() => navigate(`/${combo.shop.tag}`)}>
                <img src={combo.shop.logo_image} alt={combo.shop.logo_image} className="size-20 object-cover rounded-full border-2 border-orange-200 hover:border-orange-500 cursor-pointer transition-colors" />

              </div>
              : null
          }
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </header>

        {/* details */}
        <section className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center flex-wrap mb-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{combo.name}</h2>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-orange-600">
              ${total.toLocaleString()}
            </h4>
          </div>
          <p className="text-lg text-gray-600 mt-1">{combo.description}</p>

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

          {/* adicionales */}

          {
            additionals.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Adicionales</h3>
                <div className="grid grid-cols-2 gap-2">
                  {additionals.map((a) => (
                    <button
                      key={a.id}
                      onClick={() =>
                        setSelectedAdditionals((prev) =>
                          prev.find((x) => x.id === a.id)
                            ? prev.filter((x) => x.id !== a.id)
                            : [...prev, a]
                        )
                      }
                      className={`border rounded-lg px-3 py-2 text-base sm:text-lg ${selectedAdditionals.find((x) => x.id === a.id)
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-orange-100 hover:bg-orange-200"
                        }`}
                    >
                      {a.name} +${a.price}
                    </button>
                  ))}
                </div>
              </div>
            )
              : loaderAddtionals ? <h2 className="text-xl mt-3 italic text-orange-500">Cargando Adicionales</h2> : <h2 className="text-xl mt-3 italic text-orange-500">Esta producto no tiene adicionales</h2>
          }

          {/* footer */}
          <footer className="shrink-0 flex flex-col items-center mt-5 gap-5">
            <div className="flex justify-between w-full gap-2">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
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
