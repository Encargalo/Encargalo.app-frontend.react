/**
 * Obtiene coords localmente con timeout y devuelve la dirección formateada.
 * No bloquea la aplicación: si falla la geolocalización se setea null.
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

const getAddress = async (setAddress) => {
  try {
    // intento rápido de coords; si falla no bloqueamos la UI
    const coords = await getCoordsLocal(3000);

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
