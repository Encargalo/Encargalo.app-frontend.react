export const getCurrentLocationAndAddress = async (apiKey) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocalización no soportada');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`;
        try {
          const response = await fetch(geocodeURL);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            resolve({ address, coords });
          } else {
            reject('No se encontró dirección');
          }
        } catch (error) {
          reject(error);
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
};
