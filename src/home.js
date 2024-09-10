import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, LoadScript, Polyline } from '@react-google-maps/api';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

function Home () {
    const [currentLocation, setCurrentLocation] = useState(defaultCenter);
    const [path, setPath] = useState([defaultCenter]);

    useEffect(() => {
        fetch('http://localhost:4000/location')
          .then(res => res.json())
          .then(data => {
            setCurrentLocation(data);
            setPath([data]);
          });

          socket.on('locationUpdate', (location) => {
            setCurrentLocation(location);
            setPath(prevPath => [...prevPath, location]);
          });

          return () => socket.disconnect();

        },[]);

    return (<div>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={currentLocation}
      >
        <Marker position={currentLocation} />
        <Polyline path={path} options={{ strokeColor: "#FF0000" }} />
      </GoogleMap>
    </LoadScript>
    </div>)
}

export default Home;