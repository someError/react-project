import React from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

const MAP_STYLES = [
  {
    'featureType': 'all',
    'stylers': [
      {
        'saturation': 0
      },
      {
        'hue': '#e7ecf0'
      }
    ]
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'saturation': -70
      }
    ]
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'stylers': [
      {
        'visibility': 'simplified'
      },
      {
        'saturation': -60
      }
    ]
  }
]

const Map = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC6ou6DJ9ilaDJjnhgcBcV8jHgmwbhXP38',
    loadingElement: <div style={{height: `100%`}} />,
    containerElement: <div style={{height: `420px`}} />,
    mapElement: <div style={{height: `100%`}} />
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{lat: 51.1231148, lng: 71.4322673}}
    defaultOptions={{
      styles: MAP_STYLES,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }}
  >
    <Marker
      position={{lat: 51.1231148, lng: 71.4322673}}
      icon={{url: require('../../images/static/map-marker-icon.png')}}
    />
  </GoogleMap>
)

export default Map
