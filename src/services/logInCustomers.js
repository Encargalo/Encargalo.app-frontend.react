//caliApi
import api from "../lib/api";
import getInformationCustomer from "./getInformationCustomer";

const logInCustomers = async (data, setIsLoading, setError, onClose, onOpenWelcome) => {
  setIsLoading(true)
  try {
    const response = await api.post('/customers/sign_in', data);

    /* session created success */
    if (response.status === 201) {
      getInformationCustomer()
      onOpenWelcome()
      onClose()
    }
  } catch (error) {
    const response = error.response

    /* incorrect acces data */
    if (response.status === 422) {

      /* sets errors */
      setError('password', {
        type: "manual",
        message: "Los datos estan incorrectos"
      })
      setError('phone_number', {
        type: "manual",
        message: "Los datos estan incorrectos"
      })
    }
  } finally {
    setIsLoading(false)
  }
};

export default logInCustomers;
