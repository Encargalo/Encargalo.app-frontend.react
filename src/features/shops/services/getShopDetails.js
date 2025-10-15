import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';
import getShopCategories from './getShopCategories';

const getShopDetails = async (setShop, setCategories, tag_shop) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();

  // Función para obtener coordenadas como una Promesa
  const getCoords = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            reject(error); // Rechaza la promesa si hay un error
          }
        );
      } else {
        reject(new Error('Geolocalización no soportada por el navegador.'));
      }
    });
  };

  try {
    // Intenta obtener las coordenadas y luego los detalles de la tienda
    const coords = await getCoords();
    const response = await api.get(
      `/shops?tag=${tag_shop}&lat=${coords.lat}&lon=${coords.lon}`
    );
    if (response.status === 200) {
      const data = response.data[0];
      setShop(data);
      getShopCategories(setCategories, data.id, hideLoader);
    }
  } finally {
    hideLoader();
  }
};

export default getShopDetails;
