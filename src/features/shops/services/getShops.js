//api
import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';

const getAllShops = async (setShops) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();
  try {
    //requests
    const response = await api.get('/shops/all');
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
