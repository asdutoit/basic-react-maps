import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useCallback } from "react";
import { render } from "react-dom";
import MapGL, { Marker, NavigationControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import PinIcon from "./PinIcon";
import SearchLocationInput from "./SearchLocationInput";
import { makeStyles } from "@material-ui/core";

// Please be a decent human and don't abuse my Mapbox API token.
// If you fork this sandbox, replace my API token with your own.
// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN =
  "YOUR OWN TOKEN";

const useStyles = makeStyles({
  navigationControl: {
    position: "absolute",
    // top: 0,
    // left: 0,
    bottom: 0,
    right: 0,
    margin: "1em"
  }
});

const App = () => {
  const classes = useStyles();
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const [markerPoint, setMarkerPoint] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 8
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      console.log(newViewport);
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );

  // const getUserPosition = () => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //       setViewport({ ...viewport, latitude, longitude });
  //       setUserPosition({ latitude, longitude });
  //     });
  //   }
  // };

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
        {/* <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        /> */}
        {markerPoint.latitude === 0 && markerPoint.longitude === 0 ? null : (
          <Marker
            latitude={markerPoint.latitude}
            longitude={markerPoint.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}
        <SearchLocationInput
          setViewport={setViewport}
          setMarkerPoint={setMarkerPoint}
        />
      </MapGL>
    </div>
  );
};

render(<App />, document.getElementById("root"));
