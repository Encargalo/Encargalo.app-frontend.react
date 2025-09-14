import api from '../lib/api';

const getAddressCustomer = async (setAddress) => {
  try {
    const response = await api.get('/customers/address');

    if (response.status === 200) {
      const data = response.data;

      if (!data) {
        setAddress([]);
        return;
      }

      // 🔑 aseguramos que siempre sea array
      setAddress(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    const response = error.response;
    if (response?.status === 401) {
      setAddress([]);
    } else {
      setAddress([]);
    }
  }
};

export default getAddressCustomer;
