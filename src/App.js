import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import NavigationPage from './components/navigation'; // Ensure correct path
import MapPage from './components/MapPage'; // Import MapPage

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    // Mock example to fetch user location and facility data
    const fetchData = async () => {
      // Replace with actual API calls as needed
      setUserLocation({ lat: 17.7224525, lng: 83.2899168  }); // Example: New Delhi

      // Use the real facility coordinates you provided
      setFacility({
        id: 2,
        name: "Toilets",
        latitude: 17.7204036,
        longitude: 83.2906732,
        address: "456 Another Street"
      });
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route 
          path="/map" 
          element={
            userLocation && facility ? (
              <MapPage userLocation={userLocation} facility={facility} /> // Include MapPage
            ) : (
              <p>Loading map...</p>
            )
          } 
        />
        <Route 
          path="/navigation" 
          element={
            userLocation && facility ? (
              <NavigationPage userLocation={userLocation} facility={facility} />
            ) : (
              <p>Loading navigation...</p>
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
