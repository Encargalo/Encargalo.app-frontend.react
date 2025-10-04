import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  position: "relative",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  justifyContent: "center",
  alignItems: "center",
};

const MapComponent = ({ onAddressSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(null); // null hasta obtener ubicación
  const mapRef = useRef(null);

  // Obtener ubicación inicial
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude, // Google Maps usa lng, no long
        };
        setCenter(coords);
        fetchAddress(coords);
      },
      (error) => console.error("Error obteniendo ubicación", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchAddress = async (coords) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`;

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
      const coords = mapRef.current.getCenter();
      fetchAddress({ lat: coords.lat(), lng: coords.lng() });
    }
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapRef.current.panTo(coords);
          fetchAddress(coords);
          setCenter(coords);
        },
        (error) => console.error("Error obteniendo ubicación", error),
        { enableHighAccuracy: true }
      );
    }
  };

  // ⚠️ Renderizamos solo cuando isLoaded y center ya tienen valor
  if (!isLoaded || !center) return (
    <div className="h-2/3 w-full relative">
      <div className="w-12 h-12 border-4 border-orange-950 border-b-orange-600 rounded-full animate-spin absolute top-2/3 left-[150px] sm:left-[370px]"></div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div
        className="bg-white rounded-md p-3 shadow-md border border-gra cursor-pointer flex items-center justify-center z-10 w-2/4"
        onClick={goToCurrentLocation}
      >
        <p className="">Buscar mi ubicación</p>
      </div>
      <GoogleMap
        mapContainerStyle={{ width: "80%", height: "70%", borderRadius: "10px" }}
        center={center}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
        onIdle={handleIdle}
        options={{
          disableDefaultUI: true,
          gestureHandling: "greedy",
        }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-3xl">
        <MapPin className="size-9 text-orange-800" />
      </div>
    </div>
  );
};

export default MapComponent;
