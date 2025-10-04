//api
import api from '../lib/api';
import useLoaderStore from '../store/loaderStore';

const getCombosCarrusel = async (setItems) => {
  const { hideLoader } = useLoaderStore.getState();

  try {
    const response = await api.get('/products/category?category=combos');

    if (response.status === 200) {
      setItems(response.data);
    }
    return null;
  } finally {
    hideLoader();
  }
};

export default getCombosCarrusel;
