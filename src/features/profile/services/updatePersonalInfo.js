//api
//services

import api from '../../../lib/axios';
import getInformationCustomer from './getInformationCustomer';

const updatePersonalInfo = async (data, setConfirmUpdate, setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await api.put('/customers', data);

    if (response.status === 200) {
      setConfirmUpdate(true);
      getInformationCustomer();
    }
  } finally {
    setIsLoading(false);
    setTimeout(() => {
      setConfirmUpdate(false);
    }, 5000);
  }
};

export default updatePersonalInfo;
