import React, { useState, useEffect, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing(7)
  }
}));

const colorTheme = {
  primary: "#5cc9f5",
  secondary: "#fecd3a",
  tertiary: "#6638f0"
};

const CustomTextField = styled(TextField)`
  & label.Mui-focused {
    color: ${colorTheme.tertiary};
  }
  & .MuiOutlinedInput-root {
    background-color: white;
    fieldset {
      transition: all 0.2s;
    }
    &.Mui-focused fieldset {
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      border-color: #5cc9f5;
    }
  }
`;

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(
  updateQuery,
  autoCompleteRef,
  setViewport,
  setMarkerPoint
) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current
    // { types: ["(cities)"], componentRestrictions: { country: "us" } }
  );
  autoComplete.setFields([
    "address_components",
    "formatted_address",
    "geometry"
  ]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, setViewport, setMarkerPoint)
  );
}

async function handlePlaceSelect(updateQuery, setViewport, setMarkerPoint) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);

  console.log(addressObject);
  const { location } = addressObject.geometry;
  const { lat, lng } = location.toJSON();
  console.log(lat, lng);
  setViewport({ latitude: lat, longitude: lng, zoom: 13 });
  setMarkerPoint({ latitude: lat, longitude: lng, zoom: 13 });
}

function SearchLocationInput({ setViewport, setMarkerPoint }) {
  const [search, setSearch] = useState("");
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAmAl18mKdYVOlSDG6IRUP97gjZ4BsJdIE&libraries=places`,
      () =>
        handleScriptLoad(setQuery, autoCompleteRef, setViewport, setMarkerPoint)
    );
  }, []);

  return (
    <div className="search-location-input">
      <CustomTextField
        className={classes.margin}
        variant="outlined"
        label="Enter a location"
        size="small"
        // fullWidth
        inputRef={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
      />
      {/* <input
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      /> */}
    </div>
  );
}

export default SearchLocationInput;
