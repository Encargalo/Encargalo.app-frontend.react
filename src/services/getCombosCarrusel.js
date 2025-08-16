//api
import api from "../lib/api";

const getCombosCarrusel = async (setItems) => {
  try {
    const response = await api.get("/products/category?category=combos");

    if (response.status === 200) {
      setItems(response.data);
    }
    return null;
  } catch (error) {
    console.error("Error fetching combos:", error);
    throw error;
  }
};

export default getCombosCarrusel;
