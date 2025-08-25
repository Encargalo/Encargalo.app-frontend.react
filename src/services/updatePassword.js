import api from "../lib/api";

const updatePassword = async (data, setIsLoading, setConfirmUpdate, reset) => {
    setIsLoading(true)
    try {
        const response = await api.put('/customers/change-password', data);
        if (response.status === 200) {
            setConfirmUpdate(true)
            reset()
        }
    } catch (error) {
        return error
    } finally {
        setIsLoading(false);
        setTimeout(() => {
            setConfirmUpdate(false);
        }, 5000);
    }
};

export default updatePassword