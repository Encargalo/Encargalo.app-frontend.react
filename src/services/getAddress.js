import api from '../lib/api';

const getAddress = (setAddress) => {
  navigator.geolocation.getCurrentPosition((position) => {
    let coords = {};
    coords.lat = position.coords.latitude;
    coords.lng = position.coords.longitude;

    try {
      console.log(coords);
      const response = api.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          coords.lat
        },${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      console.log(response);

      /*  if (response.status === 'OK') {
      setAddress(data.results[0].formatted_address);
    } */
    } catch (err) {
      console.log(err);
    }
  });
};

export default getAddress;
