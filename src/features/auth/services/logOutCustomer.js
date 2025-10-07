import api from '../../../lib/axios';
import { setEncryptedItem } from '../../../utils/encryptionUtilities';
import useCartStore from '../../cart/store/cartStore';

const logOutCustomer = async () => {
  try {
    const response = await api.delete('/customers/sessions');
    if (response.status === 200) {
      const user_session = import.meta.env.VITE_USER_SESSION;
      const userSession = {
        session: false,
        data: null,
      };

      setEncryptedItem(user_session, userSession);
      useCartStore.getState().clearCart();
      location.reload();
    }
  } finally {
    return false;
  }
};

export default logOutCustomer;
