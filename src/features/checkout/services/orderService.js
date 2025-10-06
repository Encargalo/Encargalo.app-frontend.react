import api from '../lib/api';

const sendOrders = async (data) => {
  try {
    await api.post('/orders', data);
  } finally {
    return;
  }
};

export default sendOrders;
