import React from "react";
import PropTypes from "prop-types";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";

const apiKey = "";

const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "400px" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}
  >
    {props.locations.map((location, index) => (
      <MarkerWithLabel
        key={index}
        position={location.position}
        labelAnchor={new window.google.maps.Point(0, 0)}
        labelStyle={{
          backgroundColor: "white",
          fontSize: "13px",
          padding: "6px",
          borderRadius: "3px",
          fontFamily: ["fa"].includes(props.locale)
            ? "IRANSansFaNum"
            : "IRANSans",
        }}
      >
        <div>{location.description}</div>
      </MarkerWithLabel>
    ))}
  </GoogleMap>
));

Map.propTypes = {
  defaultZoom: PropTypes.number,
  defaultCenter: PropTypes.object,
  locale: PropTypes.string,
  locations: PropTypes.array,
};

export default Map;
