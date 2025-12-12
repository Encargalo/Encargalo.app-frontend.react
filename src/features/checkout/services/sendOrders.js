import api from '../../../lib/axios';

const sendOrders = async (data) => {
  try {
    await api.post('/orders', data);
  } catch (e) {
    console.log(e);
  }
};

export default sendOrders;
