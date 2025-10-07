//api
import api from '../../../lib/axios';
import getAddressCustomer from './getAddressCustomer';

const addAddress = async (
  data,
  setAddress,
  setConfirmUpdate,
  setIsLoading,
  reset
) => {
  setIsLoading(true);
  try {
    const response = await api.post('/customers/address', data);

    if (response.status === 201) {
      getAddressCustomer(setAddress);
      setConfirmUpdate(true);
      reset({
        alias: '',
        reference: '',
      });
    }
  } finally {
    setIsLoading(false);
    setTimeout(() => {
      setConfirmUpdate(false);
    }, 5000);
  }
};

export default addAddress;
