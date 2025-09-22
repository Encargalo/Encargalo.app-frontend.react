import api from '../lib/api';

const sendOrders = async (data) => {
  try {
    await api.post(data);
  } finally {
    return;
  }
};

export default sendOrders;
