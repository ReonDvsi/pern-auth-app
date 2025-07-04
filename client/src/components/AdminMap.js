import React, { useState, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const AdminMap = ({ activeCheckIns, onMarkerClick }) => {
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef(null);
  const currentCenterRef = useRef(null);
  const currentZoomRef = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  // Center on India - only used for initial load
  const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
  };

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy',
    disableDefaultUI: false,
    clickableIcons: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const onLoad = useCallback((map) => {
    mapInstanceRef.current = map;
    setMapLoaded(true);
    
    // Store initial center and zoom
    currentCenterRef.current = map.getCenter();
    currentZoomRef.current = map.getZoom();
    
    // Update stored position whenever the map moves
    map.addListener('center_changed', () => {
      if (mapInstanceRef.current) {
        currentCenterRef.current = mapInstanceRef.current.getCenter();
      }
    });
    
    map.addListener('zoom_changed', () => {
      if (mapInstanceRef.current) {
        currentZoomRef.current = mapInstanceRef.current.getZoom();
      }
    });
  }, []);

  const onUnmount = useCallback(() => {
    mapInstanceRef.current = null;
    setMapLoaded(false);
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Function to offset markers at the same location
  const offsetMarkers = useMemo(() => {
    const locationGroups = {};
    
    // Group check-ins by location
    activeCheckIns.forEach(checkIn => {
      const key = `${checkIn.latitude},${checkIn.longitude}`;
      if (!locationGroups[key]) {
        locationGroups[key] = [];
      }
      locationGroups[key].push(checkIn);
    });
    
    // Create offset positions for grouped markers
    const offsetCheckIns = [];
    Object.values(locationGroups).forEach(group => {
      if (group.length === 1) {
        // Single marker, no offset needed
        offsetCheckIns.push({
          ...group[0],
          offsetLat: parseFloat(group[0].latitude),
          offsetLng: parseFloat(group[0].longitude)
        });
      } else {
        // Multiple markers at same location, create circular offset
        const baseRadius = 0.0002; // Adjust this value to control spacing
        group.forEach((checkIn, index) => {
          const angle = (2 * Math.PI * index) / group.length;
          const offsetLat = parseFloat(checkIn.latitude) + baseRadius * Math.cos(angle);
          const offsetLng = parseFloat(checkIn.longitude) + baseRadius * Math.sin(angle);
          
          offsetCheckIns.push({
            ...checkIn,
            offsetLat,
            offsetLng,
            isGrouped: true,
            groupSize: group.length
          });
        });
      }
    });
    
    return offsetCheckIns;
  }, [activeCheckIns]);

  // Custom marker icon
  const createMarkerIcon = (isHovered, isGrouped) => ({
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    fillColor: isHovered ? '#0051D5' : (isGrouped ? '#FF6B6B' : '#4CAF50'),
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 2,
    scale: isHovered ? 2.2 : 2,
    anchor: { x: 12, y: 24 }
  });

  const handleMarkerClick = (checkIn) => {
    onMarkerClick(checkIn);
  };

  const handleMarkerMouseOver = useCallback((checkIn, e) => {
    if (e && e.domEvent && mapInstanceRef.current) {
      const mapDiv = mapInstanceRef.current.getDiv();
      const rect = mapDiv.getBoundingClientRect();
      
      // Calculate position relative to map container
      setTooltipPosition({
        x: e.domEvent.clientX - rect.left,
        y: e.domEvent.clientY - rect.top - 60
      });
      setHoveredMarkerId(checkIn.id);
    }
  }, []);

  const handleMarkerMouseOut = useCallback(() => {
    setHoveredMarkerId(null);
    setTooltipPosition(null);
  }, []);

  // Find the hovered check-in data
  const hoveredCheckIn = hoveredMarkerId 
    ? offsetMarkers.find(ci => ci.id === hoveredMarkerId) 
    : null;

  // Use the current center if available, otherwise use default
  const mapCenter = currentCenterRef.current 
    ? { lat: currentCenterRef.current.lat(), lng: currentCenterRef.current.lng() }
    : defaultCenter;

  const mapZoom = currentZoomRef.current || 5;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <LoadScript 
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {offsetMarkers.map((checkIn) => {
            const lat = checkIn.offsetLat;
            const lng = checkIn.offsetLng;
            
            if (isNaN(lat) || isNaN(lng)) {
              console.warn('Invalid coordinates for check-in:', checkIn);
              return null;
            }

            return (
              <Marker
                key={checkIn.id}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(checkIn)}
                onMouseOver={(e) => handleMarkerMouseOver(checkIn, e)}
                onMouseOut={handleMarkerMouseOut}
                icon={createMarkerIcon(hoveredMarkerId === checkIn.id, checkIn.isGrouped)}
                animation={mapLoaded ? window.google?.maps?.Animation?.DROP : null}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
      
      {/* Custom Tooltip */}
      {hoveredCheckIn && tooltipPosition && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '220px',
            zIndex: 1000,
            pointerEvents: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        >
          <p style={{ 
            margin: '0 0 6px 0', 
            fontWeight: '600', 
            fontSize: '15px',
            color: '#1d1d1f'
          }}>
            {hoveredCheckIn.first_name} {hoveredCheckIn.last_name}
          </p>
          <p style={{ 
            margin: '0 0 4px 0', 
            fontSize: '13px', 
            color: '#666' 
          }}>
            📍 {hoveredCheckIn.site_name}
            {hoveredCheckIn.isGrouped && (
              <span style={{ marginLeft: '8px', color: '#FF6B6B', fontWeight: '600' }}>
                ({hoveredCheckIn.groupSize} employees here)
              </span>
            )}
          </p>
          <p style={{ 
            margin: '0', 
            fontSize: '13px', 
            color: '#007AFF',
            fontWeight: '500'
          }}>
            ⏱️ Duration: {formatDuration(hoveredCheckIn.duration_seconds)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminMap;