import getCoordsCustomer from '../utils/getCoordsCustomer';

/**
 * Obtiene coords localmente con timeout y devuelve la dirección formateada.
 * No bloquea la aplicación: si falla la geolocalización se setea null.
 */
const getAddress = async (setAddress) => {
  let coords;
  try {
    // intento rápido de coords; si falla no bloqueamos la UI
    coords = await getCoordsCustomer(3000);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lon}&key=${apiKey}`;

    const res = await fetch(geocodeURL);
    const data = await res.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const addr = data.results[3] || data.results[0];
      setAddress(addr.formatted_address);
    } else {
      setAddress(null);
    }
  } catch (err) {
    // Si falla (permiso denegado, timeout, error fetch...) no bloquear la app
    console.warn('getAddress error:', err);
    setAddress(null);
  }
};

export default getAddress;
