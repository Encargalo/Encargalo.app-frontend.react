import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import { encargaloLogos } from '../assets/ilustrations';

const mapStyles = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];
const MapComponent = ({ onAddressSelect, onConfirm }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(null); // null hasta obtener ubicación
  const mapRef = useRef(null);

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
      console.error('Error obteniendo dirección:', error);
    }
  };

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
      (error) => console.error('Error obteniendo ubicación', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleIdle = () => {
    if (mapRef.current) {
      const coords = mapRef.current.getCenter();
      fetchAddress({ lat: coords.lat(), lng: coords.lng() });
    }
  };

  if (!isLoaded || !center)
    return (
      <div className="h-dvh w-full relative flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-orange-950 border-b-orange-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className='w-full h-dvh sm:h-[400px] relative flex flex-col mt-3 gap-2'>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '80%',
          borderRadius: '10px',
        }}
        center={center}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
        onIdle={handleIdle}
        options={{
          styles: mapStyles,
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: 'greedy',
          fullscreenControl: false,
          zoomControl: false,
          panControl: false,
          rotateControl: false,
          keyboardShortcuts: false,
          clickableIcons: false,
          disableDefaultUI: true,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 z-10"
        style={{
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
        }}
      >
        <img
          src={encargaloLogos.EncagaloLocation}
          alt="Ubicación"
          className="size-14 sm:size-12 object-contain"
          draggable={false}
        />
      </div>
      <button
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        onClick={() => onConfirm()}
      >
        Confirmar ubicación
      </button>
    </div>
  );
};

export default MapComponent;
