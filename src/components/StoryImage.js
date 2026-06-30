import { useLayoutEffect, useRef, useState } from 'react'

// Story-card thumbnail (remote WordPress media). The card's CSS already
// reserves a 16:9 box via aspect-ratio, so this only needs to add the
// shimmer-while-loading treatment and a fade-in once it's ready.
const StoryImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // onLoad alone misses images that finish loading (e.g. from cache) before
  // hydration attaches the handler — check the already-loaded state on mount.
  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className={`shimmer-frame story-card-img-frame${loaded ? '' : ' shimmer-loading'}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="story-card-img"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.35s ease' }}
      />
    </div>
  )
}

export default StoryImage
