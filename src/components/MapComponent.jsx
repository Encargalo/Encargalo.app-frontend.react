import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ onAddressSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [markerPosition, setMarkerPosition] = useState(null); // ⚠ { latitude, longitude }

  //Obtener ubicación inicial
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        setMarkerPosition(coords);
        fetchAddress(coords); // autocompletar al inicio
      },
      (error) => console.error("Error obteniendo ubicación", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // 📌 Reverse geocoding
  const fetchAddress = async (coords) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.long}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeURL);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        onAddressSelect({ address, coords }); // ⚠ mantienes { latitude, longitude }
      }
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
    }
  };

  // 📍 Cuando arrastras el marker
  const handleMarkerDragEnd = (e) => {
    const newCoords = {
      lat: e.latLng.lat(),
      long: e.latLng.lng(),
    };
    setMarkerPosition(newCoords);
    fetchAddress(newCoords);
  };

  return (
    <>
      {isLoaded && markerPosition && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: markerPosition.lat, lng: markerPosition.long }}
          zoom={15}
        >
          <Marker
            position={{ lat: markerPosition.lat, lng: markerPosition.long }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </>
  );
};

export default MapComponent;
