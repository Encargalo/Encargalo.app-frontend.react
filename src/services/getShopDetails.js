import api from "../lib/api";
import useLoaderStore from "../store/loaderStore";

const getShopDetails = async (setShop, setCategories, tag_shop) => {
  const { showLoader } = useLoaderStore.getState();
  showLoader()
  try {
    const response = await api.get(`/shops?tag=${tag_shop}`);
    if (response.status === 200) {
      const data = response.data;
      setShop(data);
      setCategories(data.categories);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getShopDetails;
