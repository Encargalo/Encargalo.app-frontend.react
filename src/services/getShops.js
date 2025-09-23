//api
import api from '../lib/api';
import useLoaderStore from '../store/loaderStore';

const getAllShops = async (setShops) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();
  try {
    //requests
    const response = await api.get('/api/shops/all');
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
