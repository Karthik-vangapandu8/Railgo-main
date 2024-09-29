import React, { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("map4.glb");
  return <primitive object={scene} scale={1} />;
}

const facilitiesData = [
  {
    id: 1,
    name: "Water",
    latitude: 17.7214519,
    longitude: 83.2904527,
    address: "123 Example Street",
  },
  {
    id: 2,
    name: "Toilets",
    latitude: 17.7204036,
    longitude: 83.2906732,
    address: "456 Another Street",
  },
  {
    id: 3,
    name: "Waiting Hall",
    latitude: 17.7220981,
    longitude: 83.2900289,
    address: "789 Third Street",
  },
  {
    id: 4,
    name: "Exit",
    latitude: 17.7224525,
    longitude: 83.2899168,
    address: "Exit Gate",
  },
];

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  const [userLocation, setUserLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Function to handle clicks and touch events
  const handleIconClick = (facility) => {
    setSelectedFacility(facility);
    if (userLocation) {
      navigate("/navigation", { state: { userLocation, facility } });
    }
  };

  return (
    <div className="relative h-screen w-full bg-gray-400">
      {/* Search bar and user info */}
      <div className="fixed z-50 flex items-center justify-between top-3 lg:left-20 left-4 right-4 lg:right-20">
        <div className="flex rounded-full shadow-md">
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
          {facilitiesData.map((facility) => (
            <button
              key={facility.id}
              onClick={() => handleIconClick(facility)}
              onTouchStart={() => handleIconClick(facility)} // Handle touch events
              className="flex items-center justify-center bg-white rounded-full shadow-md px-3 py-3 cursor-pointer" // Larger padding for click area
              style={{ zIndex: 50 }}
            >
              <FontAwesomeIcon
                icon={
                  facility.id === 1
                    ? faWater
                    : facility.id === 2
                    ? faToilet
                    : facility.id === 3
                    ? faWatchmanMonitoring
                    : faToriiGate
                }
                className="px-2 py-2 mr-1 text-xl" // Larger icon size
              />
              <p className="text-sm">{facility.name.toUpperCase()}</p>
            </button>
          ))}
        </div>
        <div className="px-2 py-2 min-w-24 bg-[#ffcc00] rounded-full shadow-md flex items-center z-50">
          <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6 mr-2" />
          {username && <span className="text-lg font-semibold">{username}</span>}
        </div>
      </div>
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model />
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>
      <div className="fixed flex flex-col gap-2 right-8 bottom-10 z-50">
        <div className="flex flex-col bg-white rounded-full shadow-md">
          <button
            className="h-10 w-10 rounded-t-full bg-white hover:bg-gray-100 cursor-pointer"
            style={{ zIndex: 50 }}
          >
            <FontAwesomeIcon icon={faPlus} className="h-[45%] w-[45%] align-middle" />
          </button>
          <button
            className="h-10 w-10 rounded-b-full bg-white hover:bg-gray-100 cursor-pointer"
            style={{ zIndex: 50 }}
          >
            <FontAwesomeIcon icon={faMinus} className="h-[45%] w-[45%] align-middle" />
          </button>
        </div>
        <button
          className="h-10 w-10 rounded-full shadow-md bg-white cursor-pointer"
          style={{ zIndex: 50 }}
        >
          <FontAwesomeIcon icon={faCrosshairs} className="h-[70%] w-[70%] align-middle" />
        </button>
      </div>
    </div>
  );
};

export default MapPage;
