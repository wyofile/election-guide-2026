import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// useLayoutEffect fires before paint (avoiding a flash of the shimmer on
// cached images) but errors during server rendering, where there's no paint
// to fire before — fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Shared candidate-portrait <Image>: shows an animated shimmer over the
// existing gradient frame until the photo loads, then fades it in.
const PortraitImage = ({ alt, src, width, height, className, style, priority }) => {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // onLoad alone misses images that finish loading (e.g. from cache) before
  // hydration attaches the handler — check the already-loaded state on mount.
  useIsomorphicLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className={`shimmer-frame${loaded ? '' : ' shimmer-loading'} ${className}`} style={style}>
      <Image
        ref={imgRef}
        alt={alt}
        src={src}
        width={width}
        height={height}
        priority={priority}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
    </div>
  )
}

export default PortraitImage
