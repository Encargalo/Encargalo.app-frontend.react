const getCoordsCustomer = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error); // Rechaza la promesa si hay un error
        }
      );
    }
  });
};

export default getCoordsCustomer;
