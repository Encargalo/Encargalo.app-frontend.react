const TTL = 5 * 60 * 1000; // cache 5 minutos

let cachedCoords = null;
let cachedAt = 0;
let pendingPromise = null;

const getCoordsCustomer = (timeout = 5000, force = false) => {
  // si hay cache válida y no forzamos, devolverla
  if (!force && cachedCoords && Date.now() - cachedAt < TTL) {
    return Promise.resolve(cachedCoords);
  }

  // si ya hay una promesa en curso, devolverla (evita múltiples prompts)
  if (!force && pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      pendingPromise = null;
      return reject(new Error('Geolocation not available'));
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      pendingPromise = null;
      reject(new Error('Geolocation timeout'));
    }, timeout + 200);

    const success = (position) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      cachedCoords = coords;
      cachedAt = Date.now();
      pendingPromise = null;
      resolve(coords);
    };

    const failure = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      pendingPromise = null;
      reject(error);
    };

    navigator.geolocation.getCurrentPosition(success, failure, {
      enableHighAccuracy: true,
      timeout,
    });
  });

  return pendingPromise;
};

export default getCoordsCustomer;
