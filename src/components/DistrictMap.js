import React, { useEffect, useRef, useState } from 'react'
import { Collection, Map, View } from 'ol'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { OSM, Vector as VectorSource } from 'ol/source.js'
import { Fill, Stroke, Style, Text } from 'ol/style.js'

import Select from 'ol/interaction/Select.js'
import { click, noModifierKeys } from 'ol/events/condition.js'
import { Control, defaults as defaultControls } from 'ol/control.js'
import { fromLonLat, transformExtent } from 'ol/proj.js'
import { usePath } from '@/lib/utils'

const MAP_CENTER = [-11971873.22771757, 5311971.846945472]
const CONSTRAINTS = [-12417689.197989667, 4975536.361069247, -11527133.271643478, 5660965.110251664]
const WYOMING_EXTENT = transformExtent(
  [-111.056888, 40.994746, -104.05216, 45.005904], 
  'EPSG:4326', 
  'EPSG:3857'
)

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
    // FIX 3: Force the map to fit the exact Wyoming bounding box coordinates
    this.getMap().getView().fit(CONSTRAINTS, { padding: [10, 10, 10, 10], duration: 500 })
  }
}

const DistrictMap = ({ chamber, activeDistrict, setActiveDistrict, targetCoords }) => {
  let districtNumberIdentifier = chamber === 'house' ? 'SLDLST' : 'SLDUST'
  let districtPrefix = chamber === 'house' ? 'HD ' : 'SD '
  let labelPrefix = chamber === 'house' ? 'House District ' : 'Senate District '

  const selectedFeatures = useRef(new Collection())
  const districtsVectorSource = useRef(new VectorSource({ format: new GeoJSON(), url: usePath(`/wyo-${chamber}-districts.json`) }))

  const [districtOptions, setDistrictOptions] = useState([])
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)

  const mapView = useRef(new View({ center: MAP_CENTER, extent: CONSTRAINTS, zoom: 0 }))

  useEffect(() => {   
    districtsVectorSource.current.on('featuresloadend', (e) => {
      setDistrictOptions(e.features.map(feat => feat.getProperties()[districtNumberIdentifier]).sort())
      setIsLoadingFeatures(false)
    })
  
    // High-End Map Styling (Crisp lines, translucent fills)
    const districtsLayer = new VectorLayer({
      source: districtsVectorSource.current,
      declutter: true, // <--- 1. Turn on the automatic decluttering engine
      style: (feature) => new Style({
        stroke: new Stroke({ color: '#517e64', width: 1 }), 
        fill: new Fill({ color: 'rgba(81, 126, 100, 0.05)' }),
        text: new Text({
          text: districtPrefix + parseInt(feature.get(districtNumberIdentifier)),
          fill: new Fill({color: '#1e293b'}),
          stroke: new Stroke({color: '#ffffff', width: 3.5}), 
          font: '700 0.8rem "Roboto", sans-serif',
          // <--- 2. REMOVE the "overflow: true" line from here
        }),
      }),
    })
  
    // High-Contrast Active State
    const selectStyle = (feature) => new Style({
      fill: new Fill({ color: 'rgba(210, 154, 48, 0.2)' }), 
      stroke: new Stroke({ color: '#d29a30', width: 2.5 }),
      text: new Text({
        text: districtPrefix + parseInt(feature.get(districtNumberIdentifier)),
        fill: new Fill({color: '#ffffff'}),
        // FIX 1: Golden halo for the active text to keep it highly visible
        stroke: new Stroke({color: '#b07d20', width: 4}), 
        font: '900 0.9rem "Roboto", sans-serif',
        overflow:true
      }),
      zIndex: 100
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
      layers: [osmLayer, districtsLayer],
      view: mapView.current
    })

    map.addInteraction(selectDistrict)

    selectDistrict.on('select', (e) => {
      if(e.selected[0]) setActiveDistrict(e.selected[0].get(districtNumberIdentifier))
      else setActiveDistrict('')
    })

    return () => map.setTarget(null)
  }, [chamber])

  // Address lookup resolver
  useEffect(() => {
    if (targetCoords && districtsVectorSource.current) {
      const selectMatchingDistrict = () => {
        const features = districtsVectorSource.current.getFeatures()
        if (features.length === 0) return
        const coords = fromLonLat(targetCoords)
        const match = features.find(feat => feat.getGeometry()?.intersectsCoordinate(coords))

        if (match) {
          const districtToSet = match.get(districtNumberIdentifier)
          selectedFeatures.current.clear()
          mapView.current.fit(match.getGeometry(), {padding: [40,40,30,30], duration: 800})
          selectedFeatures.current.push(match)
          setActiveDistrict(districtToSet)
        }
      }
      if (!isLoadingFeatures) selectMatchingDistrict()
      else districtsVectorSource.current.once('featuresloadend', selectMatchingDistrict)
    }
  }, [targetCoords, isLoadingFeatures, setActiveDistrict, districtNumberIdentifier])


  const handleManualDistrict = (districtToSet) => {
    selectedFeatures.current.clear()
    if (districtToSet !== '') {
      const mapFeature = districtsVectorSource.current.getFeatures().find(feat => feat.getProperties()[districtNumberIdentifier] === districtToSet)
      if (mapFeature) {
        mapView.current.fit(mapFeature.getGeometry(), {padding: [40,40,30,30], duration: 500})
        selectedFeatures.current.push(mapFeature)
      }
    } else {
      mapView.current.setCenter(MAP_CENTER)
      mapView.current.setZoom(0)
    }
    setActiveDistrict(districtToSet)
  }

  const handlePrevDistrict = () => {
    if (districtOptions.length === 0) return
    let idx = activeDistrict ? districtOptions.indexOf(activeDistrict) : 0
    let prevIdx = (idx - 1 + districtOptions.length) % districtOptions.length
    handleManualDistrict(districtOptions[prevIdx])
  }

  const handleNextDistrict = () => {
    if (districtOptions.length === 0) return
    let idx = activeDistrict ? districtOptions.indexOf(activeDistrict) : -1
    let nextIdx = (idx + 1) % districtOptions.length
    handleManualDistrict(districtOptions[nextIdx])
  }

  return (
    <div className="map-ui-card">
      {/* Toolbar integrated directly into the map card */}
      <div className="map-ui-header">
        <button className='map-arrow-btn' onClick={handlePrevDistrict}>&larr;</button>
        <select className="map-ui-dropdown" onChange={(e) => handleManualDistrict(e.target.value)} value={activeDistrict || ''}>
          <option value=''>Choose {chamber === 'house' ? 'House' : 'Senate'} District</option>
          {districtOptions.map(d => <option key={d} value={d}>{labelPrefix + parseInt(d.substring(1))}</option>)}
        </select>
        <button className='map-arrow-btn' onClick={handleNextDistrict}>&rarr;</button>
      </div>

      <div id={`${chamber}-map`} className="map-ui-canvas" />
      <div className="map-ui-footer">Note: Zoom in manually to view smaller districts clearly.</div>
    </div>
  )
}

export default DistrictMap