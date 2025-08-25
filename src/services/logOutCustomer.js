import api from '../lib/api';
import { setEncryptedItem } from '../utils/encryptionUtilities';

const logOutCustomer = async () => {
  try {
    const response = await api.delete('sessions');
    if (response.status === 200) {
      const user_session = import.meta.env.VITE_USER_SESSION;
      const userSession = {
        session: false,
        data: null,
      };

      setEncryptedItem(user_session, userSession);
      location.reload();
    }
  } catch {
    return false;
  }
};

export default logOutCustomer;
