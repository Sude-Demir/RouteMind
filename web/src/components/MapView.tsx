import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix leaflet default icon issue in webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  rating?: number;
  slug?: string;
  type?: 'place' | 'city';
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showNavigation?: boolean;
  singleMode?: boolean;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Tarihi': '#c0392b',
  'Doğa': '#27ae60',
  'Müze': '#8e44ad',
  'Plaj': '#2980b9',
  'Cami': '#16a085',
  'Kilise': '#d35400',
  'Park': '#2ecc71',
  'Alışveriş': '#e74c3c',
  'Yeme-İçme': '#f39c12',
  'Eğlence': '#e91e63',
  'Spor': '#3498db',
  'Kültür': '#9b59b6',
  'Diğer': '#7f8c8d',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Tarihi': '🏛️',
  'Doğa': '🌿',
  'Müze': '🖼️',
  'Plaj': '🏖️',
  'Cami': '🕌',
  'Kilise': '⛪',
  'Park': '🌳',
  'Alışveriş': '🛍️',
  'Yeme-İçme': '🍽️',
  'Eğlence': '🎡',
  'Spor': '⚽',
  'Kültür': '🎭',
  'Diğer': '📍',
};

const createCustomIcon = (category?: string, type?: 'place' | 'city') => {
  if (type === 'city') {
    return L.divIcon({
      className: 'map-custom-marker',
      html: `<div class="map-marker-pin map-marker-city">
               <span class="map-marker-emoji">🏙️</span>
             </div>`,
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -50],
    });
  }

  const color = CATEGORY_COLORS[category || ''] || '#1a3c34';
  const emoji = CATEGORY_ICONS[category || ''] || '📍';

  return L.divIcon({
    className: 'map-custom-marker',
    html: `<div class="map-marker-pin" style="--marker-color: ${color}">
             <span class="map-marker-emoji">${emoji}</span>
           </div>`,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -50],
  });
};

const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  zoom = 12,
  height = '450px',
  onMarkerClick,
  showNavigation = false,
  singleMode = false,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter: [number, number] = center || [39.9334, 32.8597]; // Default: Ankara
    
    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Premium dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update center and zoom when props change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    if (center) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, mapReady]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapReady) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    if (markers.length === 0) return;

    markers.forEach((m) => {
      const icon = createCustomIcon(m.category, m.type);
      
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(markersLayer);

      // Build popup content
      const popupContent = `
        <div class="map-popup">
          ${m.imageUrl ? `<div class="map-popup-img"><img src="${m.imageUrl}" alt="${m.title}" /></div>` : ''}
          <div class="map-popup-body">
            <h3 class="map-popup-title">${m.title}</h3>
            ${m.category ? `<span class="map-popup-cat">${CATEGORY_ICONS[m.category] || '📍'} ${m.category}</span>` : ''}
            ${m.description ? `<p class="map-popup-desc">${m.description}</p>` : ''}
            ${m.rating ? `<div class="map-popup-rating">⭐ ${m.rating.toFixed(1)}</div>` : ''}
            <div class="map-popup-actions">
              ${m.slug ? `<a href="/places/${m.slug}" class="map-popup-btn map-popup-detail">Detay Gör</a>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" class="map-popup-btn map-popup-nav">🧭 Yol Tarifi</a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        minWidth: 220,
        className: 'map-custom-popup',
      });

      marker.on('click', () => {
        setSelectedMarker(m);
        if (onMarkerClick) onMarkerClick(m);
      });
    });

    // Fit bounds if multiple markers
    if (markers.length > 1 && !singleMode) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (markers.length === 1) {
      map.flyTo([markers[0].lat, markers[0].lng], zoom, { duration: 1 });
    }
  }, [markers, mapReady, singleMode, zoom, onMarkerClick]);

  const handleLocateUser = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 14, { duration: 1.5 });
          
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'map-custom-marker',
              html: `<div class="map-marker-user">
                       <div class="map-marker-user-dot"></div>
                       <div class="map-marker-user-pulse"></div>
                     </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          }).addTo(map).bindPopup('<div class="map-popup"><div class="map-popup-body"><h3 class="map-popup-title">📍 Konumunuz</h3></div></div>');
        },
        () => {
          alert('Konum bilgisine erişilemedi.');
        }
      );
    }
  };

  const handleNavigateToSelected = () => {
    if (!selectedMarker) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`map-container ${className}`} style={{ height }}>
      <div ref={mapRef} className="map-leaflet" style={{ height: '100%' }} />
      
      {/* Map Controls */}
      <div className="map-controls">
        <button
          className="map-control-btn map-locate-btn"
          onClick={handleLocateUser}
          title="Konumumu Bul"
        >
          <span>📍</span>
        </button>

        {showNavigation && selectedMarker && (
          <button
            className="map-control-btn map-nav-btn"
            onClick={handleNavigateToSelected}
            title="Yol Tarifi Al"
          >
            <span>🧭</span>
            <span className="map-nav-label">Yol Tarifi</span>
          </button>
        )}
      </div>

      {/* Legend */}
      {!singleMode && markers.length > 0 && (
        <div className="map-legend">
          <div className="map-legend-title">📍 Harita</div>
          <div className="map-legend-count">{markers.length} konum</div>
        </div>
      )}
    </div>
  );
};

export default MapView;
