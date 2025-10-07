import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';
import getShopCategories from './getShopCategories';

const getShopDetails = async (setShop, setCategories, tag_shop) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();
  try {
    const response = await api.get(`/shops?tag=${tag_shop}`);
    if (response.status === 200) {
      const data = response.data[0];
      setShop(data);
      getShopCategories(setCategories, data.id, hideLoader);
      return;
    }
  } finally {
    return;
  }
};

export default getShopDetails;
