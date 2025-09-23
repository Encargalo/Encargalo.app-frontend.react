import api from '../lib/api';

const getShopCategories = async (setCategories, shop_id, hideLoader) => {
  try {
    const response = await api.get(`/products?shop_id=${shop_id}`);
    if (response.status === 200) {
      setCategories(response.data);
    }
  } finally {
    hideLoader();
  }
};

export default getShopCategories;
