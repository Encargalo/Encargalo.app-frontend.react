import api from '../lib/api';
import getAddressCustomer from './getAddressCustomer';

const deleteAddress = async (id, setConfirmDeleted, setAddress) => {
  try {
    const response = await api.delete(`/customers/address/${id}`);

    if (response.status === 200) {
      setConfirmDeleted(true);
      getAddressCustomer(setAddress);
      return;
    }
  } finally {
    return true;
  }
};

export default deleteAddress;
