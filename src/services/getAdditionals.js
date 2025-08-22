import api from '../lib/api';

const getAdditionals = async (setAdditionals, category_id) => {
  try {
    const response = await api.get(
      `/products/adiciones?category_id=${category_id}`
    );

    console.log(response);

    if (response.status === 200) {
      const additionals = response.data;
      setAdditionals(additionals);

      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAdditionals;
