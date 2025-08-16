//api
import api from "../lib/api";

const getAllShops = async (setShops) => {
  try {
    //requests
    const response = await api.get("/shops/all");
    //add shops
    if (response.status === 200) {
      const shops = response.data;
      setShops(shops);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllShops;
