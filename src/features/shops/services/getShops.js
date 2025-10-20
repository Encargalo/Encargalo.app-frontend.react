//api
import api from '../../../lib/axios';
//hooks
import useLoaderStore from '../../../store/loaderStore';
//lib / utils
import getCoordsCustomer from '../../../utils/getCoordsCustomer';

const getAllShops = async (setShops) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();

  try {
    // Intenta obtener las coordenadas
    const coordsCustomer = await getCoordsCustomer();
    //requests
    /* 
      Cordenadas para test
      Cambiar antes de desplegar
      lat: 3.4273946
      lon: -76.4908917
    */
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
