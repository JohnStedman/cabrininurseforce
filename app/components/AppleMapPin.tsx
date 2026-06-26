import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import '../utils/leafletSetup'; // Fix for Leaflet marker icons
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';

interface AppleMapPinProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  height?: string;
}

export function AppleMapPin({ 
  latitude, 
  longitude, 
  title = 'Location',
  description,
  height = '400px'
}: AppleMapPinProps) {
  
  // Create Apple-style pin marker
  const createApplePinIcon = () => {
    return new DivIcon({
      className: 'apple-map-pin',
      html: `
        <div style="position: relative;">
          <svg width="40" height="56" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pin shadow -->
            <ellipse cx="20" cy="52" rx="8" ry="4" fill="rgba(0,0,0,0.2)"/>
            <!-- Pin body -->
            <path d="M20 0C10.6112 0 3 7.61116 3 17C3 28.25 20 52 20 52C20 52 37 28.25 37 17C37 7.61116 29.3888 0 20 0Z" 
                  fill="#FF3B30"/>
            <path d="M20 0C10.6112 0 3 7.61116 3 17C3 28.25 20 52 20 52C20 52 37 28.25 37 17C37 7.61116 29.3888 0 20 0Z" 
                  fill="url(#pinGradient)"/>
            <!-- Inner circle -->
            <circle cx="20" cy="17" r="8" fill="white"/>
            <defs>
              <linearGradient id="pinGradient" x1="20" y1="0" x2="20" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FF3B30"/>
                <stop offset="100%" stop-color="#C4302B"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      `,
      iconSize: [40, 56],
      iconAnchor: [20, 52],
      popupAnchor: [0, -52]
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#1E88E5]" />
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
      </div>
      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          {/* Apple Maps style tiles - using a cleaner tile provider */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker
            position={[latitude, longitude]}
            icon={createApplePinIcon()}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-gray-900">{title}</p>
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
                <div className="mt-2 text-xs text-gray-500">
                  <p>Latitude: {latitude}</p>
                  <p>Longitude: {longitude}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
}