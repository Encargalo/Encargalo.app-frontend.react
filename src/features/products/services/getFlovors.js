import api from '../lib/api';

const getFlovors = async (setFlovors, item_id) => {
  try {
    const response = await api.get(`/products/flavors?item_id=${item_id}`);

    if (response.status === 200) {
      setFlovors(response.data);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getFlovors;
