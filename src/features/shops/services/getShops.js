//api
import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';
const getAllShops = async (setShops) => {
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
    // Intenta obtener las coordenadas
    const coordsCustomer = await getCoords();
    //requests
    const response = await api.get(
      `/shops/all?lat=${coordsCustomer.lat}&lon=${coordsCustomer.lon}`
    );
    //add shops
    if (response.status === 200) {
      const shops = response.data;
      setShops(shops);
      return;
    }
  } finally {
    hideLoader();
  }
};

export default getAllShops;
