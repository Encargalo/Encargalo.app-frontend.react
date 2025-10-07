import api from '../../../lib/axios';

const getAdditionals = async (setAdditionals, category_id) => {
  try {
    const response = await api.get(
      `/products/additions?category_id=${category_id}`
    );
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
