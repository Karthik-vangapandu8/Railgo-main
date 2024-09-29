import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import ngeohash from 'ngeohash';
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const NavigationPage = ({ userLocation, facility }) => {
  const [map, setMap] = useState(null);
  const [userGeoHash, setUserGeoHash] = useState('');
  const [facilityGeoHash, setFacilityGeoHash] = useState('');
  const [distance, setDistance] = useState(0);

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
    map: { height: '500px', width: '100%', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' },
    button: { padding: '10px 15px', fontSize: '16px', marginRight: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    buttonHover: { backgroundColor: '#0056b3' },
    info: { marginBottom: '20px', lineHeight: '1.6' }
  };

  useEffect(() => {
    if (!userLocation || !facility) {
      console.error("Locations are missing.");
      return;
    }

    const userHash = ngeohash.encode(userLocation.lat, userLocation.lng);
    const facilityHash = ngeohash.encode(facility.latitude, facility.longitude);
    setUserGeoHash(userHash);
    setFacilityGeoHash(facilityHash);

    const userDecoded = ngeohash.decode(userHash);
    const facilityDecoded = ngeohash.decode(facilityHash);

    const calculatedDistance = haversineDistance(
      userDecoded.latitude, userDecoded.longitude,
      facilityDecoded.latitude, facilityDecoded.longitude
    );
    setDistance(calculatedDistance);

    const initializedMap = L.map('map').setView([userLocation.lat, userLocation.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(initializedMap);

    L.marker([userLocation.lat, userLocation.lng]).addTo(initializedMap)
      .bindPopup(`You are here<br>GeoHash: ${userHash}<br>Distance to ${facility.name}: ${calculatedDistance.toFixed(2)} km`)
      .openPopup();

    L.marker([facility.latitude, facility.longitude]).addTo(initializedMap)
      .bindPopup(`${facility.name}<br>GeoHash: ${facilityHash}`)
      .openPopup();

    setMap(initializedMap);

    return () => {
      initializedMap.remove();
    };
  }, [userLocation, facility]);

  const showDirections = () => {
    if (!map) {
      console.error("Map is not initialized.");
      return;
    }

    const latLngs = [
      [userLocation.lat, userLocation.lng],
      [facility.latitude, facility.longitude]
    ];

    L.polyline(latLngs, { color: 'red', weight: 10}).addTo(map); // Draw the polyline
  };

  const speakDirections = (lang = 'en') => {
    const speech = new SpeechSynthesisUtterance();
    let directionText;

    const distanceText = distance > 1 
      ? `The distance is about ${distance.toFixed(2)} kilometers.` 
      : `The distance is about ${(distance * 1000).toFixed(0)} meters.`;

    switch (lang) {
      case 'en':
        directionText = `You are at your current location. Head towards ${facility.name}, which is located ahead. ${distanceText}`;
        speech.lang = 'en-US';
        break;

      case 'hi': // Hindi
        directionText = `आप अपनी वर्तमान स्थिति पर हैं। ${facility.name} की ओर बढ़ें, जो कि आगे स्थित है। ${distanceText}`;
        speech.lang = 'hi-IN';
        break;

      case 'te': // Telugu
        directionText = `మీరు మీ ప్రస్తుత స్థితిలో ఉన్నారు. ${facility.name} వైపుకు వెళ్ళండి, ఇది ముందుకి ఉంది. ${distanceText}`;
        speech.lang = 'te-IN';
        break;

      default:
        directionText = `You are at your current location. Head towards ${facility.name}, which is located ahead. ${distanceText}`;
        speech.lang = 'en-US';
    }

    speech.text = directionText;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Navigation Map</h2>
      <div id="map" style={styles.map}></div>
      <div style={styles.info}>
        <p>User GeoHash: {userGeoHash}</p>
        <p>Facility GeoHash: {facilityGeoHash}</p>
        <p>Distance between User and Facility: {distance.toFixed(2)} km</p>
      </div>
      <div>
        <button 
          style={styles.button} 
          onClick={showDirections}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Show Directions
        </button>
        <button 
          style={styles.button} 
          onClick={() => speakDirections('en')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Speak Directions (English)
        </button>
        <button 
          style={styles.button} 
          onClick={() => speakDirections('hi')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Speak Directions (Hindi)
        </button>
        <button 
          style={styles.button} 
          onClick={() => speakDirections('te')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Speak Directions (Telugu)
        </button>
      </div>
    </div>
  );
};
export default NavigationPage;
