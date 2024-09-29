
import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const Model = ({ onModelLoaded }) => {
  const { scene } = useGLTF('map4.glb'); 

  useEffect(() => {
    if (onModelLoaded) {
      onModelLoaded(scene); 
    }
  }, [scene, onModelLoaded]);

  return <primitive object={scene} scale={1} />; 
};

export default Model;
