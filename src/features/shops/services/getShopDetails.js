//api
import api from '../../../lib/axios';
//lib / utils
import useLoaderStore from '../../../store/loaderStore';
import getCoordsCustomer from '../../../utils/getCoordsCustomer';
//services
import getShopCategories from './getShopCategories';

const getShopDetails = async (setShop, setCategories, tag_shop) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();
  try {
    // Intenta obtener las coordenadas y luego los detalles de la tienda
    /* 
      Cordenadas para test
      Cambiar antes de desplegar
      lat: 3.4273946
      lon: -76.4908917
    */
    const coords = await getCoordsCustomer();
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
