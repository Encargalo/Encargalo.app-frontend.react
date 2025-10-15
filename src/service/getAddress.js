const getAddress = (setAddress) => {
  navigator.geolocation.getCurrentPosition((position) => {
    let coords = {};
    coords.lat = position.coords.latitude;
    coords.lng = position.coords.longitude;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`;

    fetch(geocodeURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'OK') {
          setAddress(data.results[3].formatted_address);
        }
      });
  });
};

export default getAddress;
