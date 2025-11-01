const TTL = 5 * 60 * 1000; // Cache de 5 minutos

let cachedCoords = null;
let cachedAt = 0;
let pendingPromise = null;

const getCoordsCustomer = (force = false) => {
  // Si hay caché válida y no se fuerza, devolverla.
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

    const success = (position) => {
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
      pendingPromise = null;
      reject(error);
    };

    navigator.geolocation.getCurrentPosition(success, failure, {
      enableHighAccuracy: true,
    });
  });

  return pendingPromise;
};

export default getCoordsCustomer;
