import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  position: "relative",
};

const MapComponent = ({ onAddressSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(null);
  const mapRef = useRef(null);

  // Obtener ubicación inicial
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        setCenter(coords); // ahora sí usamos setCenter
        fetchAddress(coords);
      },
      (error) => {
        console.error("Error obteniendo ubicación", error);
        // opcional: asignar un centro por defecto si falla la geolocalización
        // setCenter({ lat: 0, long: 0 });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchAddress = async (coords) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.long}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeURL);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        onAddressSelect({ address, coords });
      }
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
    }
  };

  const handleIdle = () => {
    if (mapRef.current) {
      const idleCenter = mapRef.current.getCenter();
      const coords = {
        lat: idleCenter.lat(),
        long: idleCenter.lng(),
      };
      fetchAddress(coords);
      setCenter(coords); // actualizar el estado mientras se mueve el mapa
    }
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
          mapRef.current.panTo({ lat: coords.lat, lng: coords.long });
          fetchAddress(coords);
          setCenter(coords);
        },
        (error) => console.error("Error obteniendo ubicación", error),
        { enableHighAccuracy: true }
      );
    }
  };

  // Solo renderiza el mapa cuando la geolocalización ya esté lista
  return (
    <>
      {isLoaded && center && (
        <div style={containerStyle}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: center.lat, lng: center.long }} // SOLO al cargar
            zoom={15}
            onLoad={(map) => (mapRef.current = map)}
            onIdle={handleIdle}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              gestureHandling: "greedy",
            }}
          />
          {/* Marker fijo al centro */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-3xl">
            <MapPin className="size-9 text-orange-800" />
          </div>
          {/* Botón buscar ubicación */}
          <div
            className="absolute top-3 left-3 bg-white rounded-md p-3 shadow-md cursor-pointer flex items-center justify-center z-10"
            onClick={goToCurrentLocation}
          >
            <p className="text-sm">Buscar mi ubicación</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MapComponent;
