import api from '../lib/api';

const getBestSellingFoods = async (setBestSellingFoods, shop_id) => {
  try {
    const response = await api.get(`/products/best-sellers?shop_id=${shop_id}`);
    if (response.status === 200) {
      setBestSellingFoods(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export default getBestSellingFoods;
