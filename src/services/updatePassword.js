import api from '../lib/api';

const updatePassword = async (data, setIsLoading, setConfirmUpdate, reset) => {
  setIsLoading(true);
  try {
    const response = await api.put('/api/customers/change-password', data);
    if (response.status === 200) {
      setConfirmUpdate(true);
      reset();
    }
  } finally {
    setIsLoading(false);
    setTimeout(() => {
      setConfirmUpdate(false);
    }, 5000);
  }
};

export default updatePassword;
