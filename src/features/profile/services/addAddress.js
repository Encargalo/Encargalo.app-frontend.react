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
    const payload = {
      type: 'Home',
      label: data.label,
      address: data.address,
      lat: data.lat,
      long: data.long,
      instructions: data.instructions,
      extra: {
        details: data.extra?.details || '',
      },
    };

    const response = await api.post('/customers/address', payload);

    if (response.status === 201) {
      getAddressCustomer(setAddress);
      setConfirmUpdate(true);
      reset({
        label: '',
        instructions: '',
        details: '',
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
