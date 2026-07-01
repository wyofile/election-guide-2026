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
import { Attribution, Control, defaults as defaultControls } from 'ol/control.js'
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
  street, setStreet, city, setCity, zip, setZip, 
  handleAddressSearch, handleCurrentLocation, handleClearAddress, searchStatus, targetCoords 
}) => {
  
  let districtNumberIdentifier = chamber === 'house' ? 'SLDLST' : 'SLDUST'
  let districtPrefix = chamber === 'house' ? 'HD ' : 'SD '

  const selectedFeatures = useRef(new Collection())
  const markerFeature = useRef(new Feature())
  const districtsVectorSource = useRef(new VectorSource({ format: new GeoJSON(), url: usePath(`/wyo-${chamber}-districts.json`) }))
  const mapView = useRef(new View({ center: MAP_CENTER, extent: CONSTRAINTS, zoom: 0 }))
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)
  const [searchOpen, setSearchOpen] = useState(true)

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
      controls: defaultControls({ attribution: false }).extend([
        new Attribution({ collapsible: true, collapsed: true }),
        new ResetControl()
      ]),
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

  // Collapse mobile search panel on successful locate
  useEffect(() => {
    if (targetCoords) setSearchOpen(false)
  }, [targetCoords])

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
      <a className="link-anchor" id={`${chamber}-map-anchor`}></a>

      {/* 1. Dedicated Header for the Map Note */}
      <div className="map-ui-note-top">
        Note: Zoom in manually to view smaller districts clearly.
      </div>

      <div className="map-ui-canvas-wrapper">
        {searchStatus && (
          <div className="map-overlay-status">{searchStatus}</div>
        )}
        {activeDistrict && (
          <button
            key={activeDistrict}
            className="map-overlay-candidates"
            onClick={() => document.getElementById(`${chamber}-candidates-anchor`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Candidates ↓
          </button>
        )}
        <div id={`${chamber}-map`} className="map-ui-canvas" />
      </div>

      {/* 3. Address Search Form at the Bottom */}
      <div className="map-search-panel">
        <h4 className="search-header-title">Find My District</h4>

        {/* Mobile-only toggle — always visible, collapses form below */}
        <button
          type="button"
          className="search-panel-toggle"
          onClick={() => setSearchOpen(o => !o)}
          aria-expanded={searchOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
          </svg>
          Find My District by Address
          <svg className={`toggle-chevron${searchOpen ? ' is-open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className={`search-form-collapse${searchOpen ? ' is-open' : ''}`}>
        <form onSubmit={handleAddressSearch} className="multi-field-form">
          
          <div className="form-row">
            <input 
              id={`street-${chamber}`}
              type="text" 
              placeholder="Street Address (e.g. 123 Main St)" 
              aria-label="Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row split-row">
            <div className="input-group">
              <input 
                id={`city-${chamber}`}
                type="text" 
                placeholder="City" 
                aria-label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="input-group zip-group">
              <input 
                id={`zip-${chamber}`}
                type="text" 
                placeholder="Zip Code" 
                aria-label="Zip Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="action-btn location-btn" 
              onClick={handleCurrentLocation} 
              title="Use Current Location"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
              </svg>
              <span>Locate Me</span>
            </button>

            <div className="right-actions">
              {(street || city || zip) && (
                <button type="button" className="action-btn clear-btn" onClick={handleClearAddress}>
                  Clear
                </button>
              )}
              <button type="submit" className="action-btn search-btn">Search</button>
            </div>
          </div>
        </form>
        </div>
      </div>

    </div>
  )
}

export default DistrictMap