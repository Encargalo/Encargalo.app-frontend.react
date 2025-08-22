import api from '../lib/api';

const getAddressCustomer = async (setAddress, setAddressHeader) => {
  try {
    const response = await api.get('/customers/address');

    if (response.status === 200) {
      if (response.data === null) {
        setAddress(false);
        return;
      }

      setAddress(true);
      setAddressHeader(response.data);
    }
  } catch (error) {
    const response = error.response;
    if (response.status === 401) {
      setAddress(false);
    }
  }
};

export default getAddressCustomer;
