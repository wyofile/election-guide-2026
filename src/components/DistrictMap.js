import React, { useEffect, useRef, useState } from 'react'
import { Collection, Map, View } from 'ol'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { OSM, Vector as VectorSource } from 'ol/source.js'
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'

import Select from 'ol/interaction/Select.js'
import { click, noModifierKeys } from 'ol/events/condition.js'
import { Control, defaults as defaultControls } from 'ol/control.js'
import { fromLonLat, transformExtent } from 'ol/proj.js'
import { usePath } from '@/lib/utils'

const MAP_CENTER = [-11971873.22771757, 5311971.846945472]
const CONSTRAINTS = [-12417689.197989667, 4975536.361069247, -11527133.271643478, 5660965.110251664]
const WYOMING_EXTENT = transformExtent([-111.056888, 40.994746, -104.05216, 45.005904], 'EPSG:4326', 'EPSG:3857')

class ResetControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {}
    const button = document.createElement('button')
    button.innerHTML = 'Reset View'
    const element = document.createElement('div')
    element.className = 'reset-map ol-unselectable ol-control'
    element.appendChild(button)
    super({ element: element, target: options.target })
    button.addEventListener('click', this.handleReset.bind(this), false)
  }
  handleReset() {
    this.getMap().getView().fit(CONSTRAINTS, { padding: [10, 10, 10, 10], duration: 500 })
  }
}

const DistrictMap = ({ 
  chamber, activeDistrict, setActiveDistrict, setDistrictOptions, 
  address, setAddress, handleAddressSearch, handleCurrentLocation, handleClearAddress, searchStatus, targetCoords 
}) => {
  
  let districtNumberIdentifier = chamber === 'house' ? 'SLDLST' : 'SLDUST'
  let districtPrefix = chamber === 'house' ? 'HD ' : 'SD '

  const selectedFeatures = useRef(new Collection())
  const markerFeature = useRef(new Feature())
  const districtsVectorSource = useRef(new VectorSource({ format: new GeoJSON(), url: usePath(`/wyo-${chamber}-districts.json`) }))
  const mapView = useRef(new View({ center: MAP_CENTER, extent: CONSTRAINTS, zoom: 0 }))
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)

  useEffect(() => {   
    districtsVectorSource.current.on('featuresloadend', (e) => {
      const options = e.features.map(feat => feat.getProperties()[districtNumberIdentifier]).sort()
      setDistrictOptions(options)
      setIsLoadingFeatures(false)
    })
  
    const districtsLayer = new VectorLayer({
      source: districtsVectorSource.current,
      declutter: true,
      style: (feature) => new Style({
        stroke: new Stroke({ color: '#517e64', width: 1 }), 
        fill: new Fill({ color: 'rgba(81, 126, 100, 0.05)' }),
        text: new Text({
          text: districtPrefix + parseInt(feature.get(districtNumberIdentifier)),
          fill: new Fill({color: '#1e293b'}),
          stroke: new Stroke({color: '#ffffff', width: 3.5}), 
          font: '700 0.8rem "Roboto", sans-serif',
        }),
      }),
    })
  
    const selectStyle = (feature) => new Style({
      fill: new Fill({ color: 'rgba(210, 154, 48, 0.2)' }), 
      stroke: new Stroke({ color: '#d29a30', width: 2.5 }),
      text: new Text({
        text: districtPrefix + parseInt(feature.get(districtNumberIdentifier)),
        fill: new Fill({color: '#ffffff'}),
        stroke: new Stroke({color: '#b07d20', width: 4}), 
        font: '900 0.9rem "Roboto", sans-serif',
        overflow: true
      }),
      zIndex: 100
    })
    
    // User Location Marker Layer
    const markerLayer = new VectorLayer({
      source: new VectorSource({ features: [markerFeature.current] }),
      zIndex: 200,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#e11d48' }), // Bold red marker
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      })
    })

    const osmLayer = new TileLayer({ source: new OSM(), extent: WYOMING_EXTENT })
    const selectDistrict = new Select({
      condition: (ev) => click(ev) && noModifierKeys(ev),
      style: selectStyle,
      features: selectedFeatures.current
    })

    const map = new Map({
      target: `${chamber}-map`,
      controls: defaultControls().extend([new ResetControl()]),
      layers: [osmLayer, districtsLayer, markerLayer],
      view: mapView.current
    })

    map.addInteraction(selectDistrict)

    selectDistrict.on('select', (e) => {
      // 1. Set the active district based on the clicked map feature
      if(e.selected[0]) {
        setActiveDistrict(e.selected[0].get(districtNumberIdentifier))
      } else {
        setActiveDistrict('')
      }
      
      // 2. Clear the address search form because the user clicked manually
      if (handleClearAddress) {
        handleClearAddress()
      }
    })

    return () => map.setTarget(null)
  }, [chamber, setDistrictOptions])

  // Single Source of Truth Map Pan: Responds to parent changes
  useEffect(() => {
    if (!isLoadingFeatures) {
      selectedFeatures.current.clear()
      if (activeDistrict !== '') {
        const mapFeature = districtsVectorSource.current.getFeatures().find(feat => feat.getProperties()[districtNumberIdentifier] === activeDistrict)
        if (mapFeature) {
          selectedFeatures.current.push(mapFeature)
          mapView.current.fit(mapFeature.getGeometry(), {padding: [40,40,30,30], duration: 500})
        }
      } else {
        mapView.current.setCenter(MAP_CENTER)
        mapView.current.setZoom(0)
      }
    }
  }, [activeDistrict, isLoadingFeatures])

  // Target Location Resolver & Marker Placement
  useEffect(() => {
    if (targetCoords && districtsVectorSource.current) {
      markerFeature.current.setGeometry(new Point(fromLonLat(targetCoords)))
      
      const selectMatchingDistrict = () => {
        const features = districtsVectorSource.current.getFeatures()
        if (features.length === 0) return
        const coords = fromLonLat(targetCoords)
        const match = features.find(feat => feat.getGeometry()?.intersectsCoordinate(coords))

        if (match) {
          const districtToSet = match.get(districtNumberIdentifier)
          setActiveDistrict(districtToSet)
        }
      }
      if (!isLoadingFeatures) selectMatchingDistrict()
      else districtsVectorSource.current.once('featuresloadend', selectMatchingDistrict)
    } else {
      markerFeature.current.setGeometry(null)
    }
  }, [targetCoords, isLoadingFeatures, setActiveDistrict])

  return (
    <div className="map-ui-card">
      
      {/* 1. Dedicated Header for the Search Box */}
      <div className="map-search-header">
        <form onSubmit={handleAddressSearch} className="address-form-inline">
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Enter your address..." 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="dashboard-search-input"
            />
            {address && (
              <button type="button" className="clear-address-btn" onClick={handleClearAddress}>
                &times;
              </button>
            )}
          </div>
          <button 
            type="button" 
            className="current-location-btn" 
            onClick={handleCurrentLocation} 
            title="Use Current Location"
          >
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="24px" height="24px" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M13 4.069V2h-2v2.069A8.01 8.01 0 0 0 4.069 11H2v2h2.069A8.008 8.008 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/></svg>
          </button>
          <button type="submit" className="dashboard-search-btn">Search</button>
        </form>

      </div>

      <div className="map-ui-canvas-wrapper">
        {/* Permanent Bottom-Right Notification */}
        {searchStatus && (
          <div className="map-overlay-status">
            {searchStatus}
          </div>
        )}

        {/* 2. The Map Canvas */}
        <div id={`${chamber}-map`} className="map-ui-canvas" />
      </div>

      <div className="map-ui-footer">Note: Zoom in manually to view smaller districts clearly.</div>
    </div>
  )
}

export default DistrictMap