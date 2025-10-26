//api
import api from '../../../lib/axios';
import useLoaderStore from '../../../store/loaderStore';

/**
 * Obtener coords localmente con timeout.
 * Resuelve { lat, lon } o rechaza si no hay geolocalización.
 * No bloquea: quien llame puede usar fallback si falla.
 */
const getCoordsLocal = (timeout = 3000) =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not available'));
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('Geolocation timeout'));
    }, timeout);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      },
      { enableHighAccuracy: true, timeout }
    );
  });

const getAllShops = async (setShops) => {
  const { showLoader, hideLoader } = useLoaderStore.getState();
  showLoader();

  try {
    let coordsCustomer;
    try {
      // intento rápido de obtener coords; si falla se usa fallback abajo
      coordsCustomer = await getCoordsLocal(3000);
    } catch (err) {
      // no detener la carga: usar coords fallback para obtener tiendas rápido
      console.warn('No se obtuvieron coords en tiempo, usando fallback:', err);
      coordsCustomer = { lat: 3.4273946, lon: -76.4908917 }; // ajusta a tu ciudad
    }

    try {
      const response = await api.get(
        `/shops/all?lat=${coordsCustomer.lat}&lon=${coordsCustomer.lon}`
      );

      if (response.status === 200) setShops(response.data);
    } catch (apiErr) {
      console.error('getAllShops - API error:', apiErr);
    }
  } catch (error) {
    console.error('getAllShops error:', error);
  } finally {
    hideLoader();
  }
};

export default getAllShops;
