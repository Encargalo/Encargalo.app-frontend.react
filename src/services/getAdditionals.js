import api from '../lib/api';

const getAdditionals = async (
  setAdditionals,
  setLoaderAdditionals,
  category_id
) => {
  setLoaderAdditionals(true);
  try {
    const response = await api.get(
      `/products/adiciones?category_id=${category_id}`
    );

    if (response.status === 200) {
      const additionals = response.data;
      setLoaderAdditionals(false);
      setAdditionals(additionals);

      return;
    }
  } catch (error) {
    if (error.response.status === 404) {
      setLoaderAdditionals(false);
    }
  }
};

export default getAdditionals;
