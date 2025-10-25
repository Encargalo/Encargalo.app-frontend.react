const getAddress = (setAddress) => {
  if (!navigator.geolocation) {
    console.warn('Geolocation not available');
    setAddress(null);
    return;
  }

  const success = (position) => {
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`;

    fetch(geocodeURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          // protejo índice por si no existe
          const addr = data.results[3] || data.results[0];
          setAddress(addr.formatted_address);
        } else {
          setAddress(null);
        }
      })
      .catch((err) => {
        console.error('Geocode fetch error', err);
        setAddress(null);
      });
  };

  const failure = (err) => {
    console.warn('getAddress error:', err);
    setAddress(null);
  };

  // timeout opcional en opciones (algunas plataformas lo ignoran)
  navigator.geolocation.getCurrentPosition(success, failure, {
    enableHighAccuracy: true,
    timeout: 5000,
  });
};

export default getAddress;
