import api from '../../../lib/axios';

const sendOrders = async (data) => {
  console.log(data);
  try {
    const response = await api.post('/orders', data);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

export default sendOrders;
