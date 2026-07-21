import { useEffect, useState } from 'react'
import { getAppAssetSignedUrl } from '../../services/appAssets'

const TITAN_BACKGROUND_ASSET_KEY = 'titanfit_background_primary'

function TitanBackground({
  children,
  className = '',
  overlay = true,
}) {
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [backgroundError, setBackgroundError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadBackground() {
      try {
        setBackgroundError(null)

        const asset = await getAppAssetSignedUrl(
          TITAN_BACKGROUND_ASSET_KEY
        )

        if (isMounted) {
          setBackgroundUrl(asset.signedUrl)
        }
      } catch (error) {
        console.error('TitanBackground:', error)

        if (isMounted) {
          setBackgroundError(error.message)
        }
      }
    }

    loadBackground()

    return () => {
      isMounted = false
    }
  }, [])

  const backgroundStyle = backgroundUrl
    ? {
        backgroundImage: `url("${backgroundUrl}")`,
      }
    : undefined

  const backgroundStateClass = backgroundLoaded
    ? 'titan-background--loaded'
    : 'titan-background--loading'

  return (
    <main
      className={[
        'titan-background',
        backgroundStateClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={backgroundStyle}
    >
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          alt=""
          aria-hidden="true"
          className="titan-background__preloader"
          onLoad={() => setBackgroundLoaded(true)}
          onError={() => {
            setBackgroundLoaded(false)
            setBackgroundError(
              'La imagen oficial del fondo no pudo cargarse.'
            )
          }}
        />
      )}

      {overlay && (
        <div
          className="titan-background__overlay"
          aria-hidden="true"
        />
      )}

      <div className="titan-background__content">
        {children}
      </div>

      {import.meta.env.DEV && backgroundError && (
        <p className="titan-background__debug-error">
          {backgroundError}
        </p>
      )}
    </main>
  )
}

export default TitanBackground