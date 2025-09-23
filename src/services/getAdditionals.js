import api from '../lib/api';

const getAdditionals = async (setAdditionals, shop_id) => {
  try {
    const response = await api.get(`/products/additions?shop_id=${shop_id}`);
    if (response.status === 200) {
      const additionals = response.data;
      setAdditionals(additionals);
      return;
    }
  } finally {
    return;
  }
};

export default getAdditionals;
