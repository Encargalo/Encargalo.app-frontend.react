import api from '../../../lib/axios';

const sendOrders = async (data) => {
  try {
    await api.post('/orders', data);
  } finally {
    return;
  }
};

export default sendOrders;
