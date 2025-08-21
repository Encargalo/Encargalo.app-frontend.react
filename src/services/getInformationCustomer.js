//api
import api from "../lib/api";
//utils
import { setEncryptedItem } from "../utils/encryptionUtilities";

const getInformationCustomer = async () => {
  try {
    const response = await api.get('/customers');

    if (response.status === 200) {
      const user_session = 'user_session';
      const userSession = {
        session: true,
        data: response.data,
      };
      setEncryptedItem(user_session, userSession);

    }
  } catch (error) {
    const response = error.response

    if (response.status === 401) {
      //validate user session
      const user_session = 'user_session';
      const userSession = {
        session: false,
        data: null,
      };

      setEncryptedItem(user_session, userSession);
    }

  }
};

export default getInformationCustomer;
