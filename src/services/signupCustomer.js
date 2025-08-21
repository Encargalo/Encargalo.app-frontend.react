//api
import api from '../lib/api';
//utils
import { setEncryptedItem } from '../utils/encryptionUtilities';
import getInformationCustomer from './getInformationCustomer';

const signupCustomer = async (
    data,
    setIsLoading,
    setError,
    reset,
    onClose,
    onOpenWelcome
) => {
    // Activa el spinner
    setIsLoading(true);

    try {
        const response = await api.post('/customers', data);

        console.log(response)

        if (response.status === 201) {
            // Actualiza el user_session con los datos de la respuesta
            getInformationCustomer()
            onOpenWelcome()
            onClose()
            reset()

        }
    } catch (error) {
        const response = error.response
        console.log(error)

        if (response.status === 409) {
            setError('phone', {
                type: 'manual',
                message: 'El télefono esta en uso'
            })
        }
    } finally {
        // Desactiva el spinner
        setIsLoading(false);
    }
};

export default signupCustomer;
