import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrosshairs,
  faMinus,
  faPlus,
  faSearch,
  faToilet,
  faToriiGate,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faWatchmanMonitoring } from "@fortawesome/free-brands-svg-icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);
  const [userLat, setUserLat] = useState(17.7224525); // Static user latitude
  const [userLng, setUserLng] = useState(83.2899168); // Static user longitude
  const [distance, setDistance] = useState(null); // State to store the calculated distance

  // Define the custom SVG icons
  const getCustomIcon = (svgString) => {
    return L.divIcon({
      className: "custom-icon",
      html: svgString,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Function to handle calculating and displaying distance
  const calculateDistance = async (facilityLat, facilityLng) => {
    const data = {
      userLat: userLat,
      userLng: userLng,
      facilityLat: facilityLat,
      facilityLng: facilityLng,
    };

    try {
      const response = await fetch("http://localhost:8000/calculate-distance", {
        // Changed port to 8000
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setDistance(result.distance); // Store the distance in the state
      alert(`Distance: ${result.distance} meters`); // Display the distance in an alert
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      const imageWidth = 1332; // width of your map image
      const imageHeight = 942; // height of your map image
      const imageUrl = "mapimage.png"; // Set path to your map image

      // Initialize the map
      mapRef.current = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        center: [imageHeight / 2, imageWidth / 2],
        zoom: 1,
      });

      const bounds = [
        [0, 0],
        [imageHeight, imageWidth],
      ];
      L.imageOverlay(imageUrl, bounds).addTo(mapRef.current);

      // Initialize marker group and add it to the map
      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);

      // Corrected locations for the markers (in pixel coordinates)
      const locations = [
        {
          coords: [906.5, 58.5],
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 2,22 22,22" fill="green" /></svg>',
          name: "Facility 1",
        },
        {
          coords: [906, 88],
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 2,22 22,22" fill="green" /></svg>',
          name: "Facility 2",
        },
        {
          coords: [913.5, 216],
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 2,22 22,22" fill="green" /></svg>',
          name: "Facility 3",
        },
      ];

      // Add markers for each location with custom SVG icons and click event to calculate distance
      locations.forEach((location) => {
        const marker = L.marker(location.coords, {
          icon: getCustomIcon(location.icon),
        })
          .addTo(markerGroupRef.current)
          .bindPopup(location.name);

        // Event listener to calculate dist
        marker.on("click", () => {
          const [facilityLat, facilityLng] = location.coords;
          calculateDistance(facilityLat, facilityLng);
        });
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full bg-gray-400">
      {/* Search bar and user info */}
      <div className="fixed z-50 flex items-center justify-between top-3 lg:left-20 left-4 right-4 lg:right-20">
        <div className="flex">
          <input
            type="text"
            placeholder="Search..."
            className="h-10 lg:w-96 pl-2 rounded-l-full outline-none"
          />
          <div className="bg-white h-10 flex items-center px-2 rounded-r-full">
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center bg-white rounded-full px-1 py-1">
            <FontAwesomeIcon icon={faWater} className="px-1 py-1 mr-1" />
            <p>DRINK WATER</p>
          </button>
          <button className="flex items-center justify-center bg-white rounded-full px-1 py-1">
            <FontAwesomeIcon icon={faToilet} className="px-1 py-1 mr-1" />
            <p>TOILETS</p>
          </button>
          <button className="flex items-center justify-center bg-white rounded-full px-1 py-1">
            <FontAwesomeIcon
              icon={faWatchmanMonitoring}
              className="px-1 py-1 mr-1"
            />
            <p>WAITING HALL</p>
          </button>
          <button className="flex items-center justify-center bg-white rounded-full px-1 py-1">
            <FontAwesomeIcon icon={faToriiGate} className="px-1 py-1 mr-1" />
            <p>EXIT</p>
          </button>
        </div>

        <div className="px-2 py-2 min-w-24 bg-[#ffcc00] rounded-full flex items-center z-50">
          <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6 mr-2" />
          {username && (
            <span className="text-lg font-semibold">{username}</span>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="fixed flex flex-col gap-2 right-8 bottom-10 z-50">
        <div className="flex flex-col bg-white rounded-full">
          <button className="h-10 w-10 rounded-t-full bg-white cursor-pointer">
            <FontAwesomeIcon
              icon={faPlus}
              className="h-[45%] w-[45%] align-middle"
            />
          </button>
          <button className="h-10 w-10 rounded-b-full bg-white cursor-pointer">
            <FontAwesomeIcon
              icon={faMinus}
              className="h-[45%] w-[45%] align-middle"
            />
          </button>
        </div>
        <button className="h-10 w-10 rounded-full bg-white cursor-pointer">
          <FontAwesomeIcon
            icon={faCrosshairs}
            className="h-[70%] w-[70%] align-middle"
          />
        </button>
      </div>

      {/* Map container */}
      <div id="map" className="w-full h-full"></div>

      {/* Display calculated distance */}
      {distance && (
        <div className="fixed bottom-5 left-5 bg-white p-4 rounded shadow-lg z-50">
          Distance: {distance} meters
        </div>
      )}
    </div>
  );
};

export default MapPage;
