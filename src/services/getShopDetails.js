import api from "../lib/api";

const getShopDetails = async (setShop, setCategories, tag_shop) => {
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
