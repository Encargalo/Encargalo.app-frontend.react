//api
import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';
import getCoordsCustomer from '../../../utils/getCoordsCustomer';

const getAllShops = async (setShops) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();

  try {
    let coordsCustomer;
    try {
      coordsCustomer = await getCoordsCustomer(5000);
    } catch (err) {
      return err;
    }

    const response = await api.get(
      `/shops/all?lat=${coordsCustomer.lat}&lon=${coordsCustomer.lon}`
    );

    if (response.status === 200) setShops(response.data);
  } finally {
    hideLoader();
  }
};

export default getAllShops;
