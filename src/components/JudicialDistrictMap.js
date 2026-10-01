import { useEffect, useRef, useState } from 'react'
import { usePath } from '@/lib/utils'

const DEFAULT_FILL = '#e2e8f0'
const HOVER_FILL = '#c7d9d4'
const SELECTED_FILL = '#89a6a1'

// Any one of the judicial-district SVGs works as the base geometry — every
// county's fill gets overridden by this component based on selection/hover,
// so the file's own baked-in highlight colors are never used.
const JudicialDistrictMap = ({ countyDistricts, selectedCounty, onSelectCounty }) => {
  const containerRef = useRef(null)
  const mapSrc = usePath('/judicial-districts/d-1.svg')
  const [svgMarkup, setSvgMarkup] = useState(null)
  const [hoveredCounty, setHoveredCounty] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(mapSrc)
      .then(res => res.text())
      .then(text => { if (!cancelled) setSvgMarkup(text) })
    return () => { cancelled = true }
  }, [mapSrc])

  // Wire up click/hover once the SVG markup is in the DOM
  useEffect(() => {
    const container = containerRef.current
    if (!container || !svgMarkup) return

    const svg = container.querySelector('svg')
    if (svg) {
      svg.removeAttribute('width')
      svg.removeAttribute('height')
    }

    const countyFromEvent = (e) => {
      const path = e.target.closest('path[id]')
      if (!path) return null
      const name = path.id.replace(/_/g, ' ')
      return countyDistricts[name] ? name : null
    }

    const onClick = (e) => {
      const name = countyFromEvent(e)
      if (name) onSelectCounty(name)
    }
    const onMove = (e) => setHoveredCounty(countyFromEvent(e))
    const onLeave = () => setHoveredCounty(null)

    container.querySelectorAll('path[id]').forEach(p => {
      if (countyDistricts[p.id.replace(/_/g, ' ')]) p.style.cursor = 'pointer'
    })

    container.addEventListener('click', onClick)
    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)

    return () => {
      container.removeEventListener('click', onClick)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [svgMarkup, countyDistricts, onSelectCounty])

  // Recolor every county whenever the selection or hover target changes
  useEffect(() => {
    const container = containerRef.current
    if (!container || !svgMarkup) return

    const selectedDistrict = selectedCounty ? countyDistricts[selectedCounty] : null
    const hoveredDistrict = hoveredCounty ? countyDistricts[hoveredCounty] : null

    container.querySelectorAll('path[id]').forEach(path => {
      const name = path.id.replace(/_/g, ' ')
      const districtIndex = countyDistricts[name]
      if (!districtIndex) return

      path.style.fill = districtIndex === selectedDistrict
        ? SELECTED_FILL
        : districtIndex === hoveredDistrict
          ? HOVER_FILL
          : DEFAULT_FILL
    })
  }, [svgMarkup, selectedCounty, hoveredCounty, countyDistricts])

  return (
    <div className="jd-interactive-map-frame">
      {!svgMarkup && <div className="jd-interactive-map-loading" />}
      <div
        className="jd-interactive-map"
        ref={containerRef}
        aria-hidden="true"
        dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
      />
    </div>
  )
}

export default JudicialDistrictMap
