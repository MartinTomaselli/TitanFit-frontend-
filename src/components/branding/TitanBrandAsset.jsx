import { useEffect, useState } from 'react'
import { getAppAssetSignedUrl } from '../../services/appAssets'

function TitanBrandAsset({
  assetKey,
  className = '',
  alt = '',
  loadingClassName = '',
  onLoad,
  onError,
}) {
  const [assetUrl, setAssetUrl] = useState('')
  const [assetAlt, setAssetAlt] = useState(alt)
  const [isLoaded, setIsLoaded] = useState(false)
  const [assetError, setAssetError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadAsset() {
      try {
        setAssetError(null)
        setIsLoaded(false)

        const asset = await getAppAssetSignedUrl(assetKey)

        if (!isMounted) return

        setAssetUrl(asset.signedUrl)
        setAssetAlt(alt || asset.altText || '')
      } catch (error) {
        console.error(`TitanBrandAsset (${assetKey}):`, error)

        if (isMounted) {
          setAssetError(error.message)
          onError?.(error)
        }
      }
    }

    loadAsset()

    return () => {
      isMounted = false
    }
  }, [assetKey, alt, onError])

  if (assetError) {
    return import.meta.env.DEV ? (
      <span className="titan-brand-asset__error">
        {assetError}
      </span>
    ) : null
  }

  if (!assetUrl) {
    return (
      <span
        className={[
          'titan-brand-asset__placeholder',
          loadingClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      src={assetUrl}
      alt={assetAlt}
      className={[
        'titan-brand-asset',
        isLoaded ? 'titan-brand-asset--loaded' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onLoad={(event) => {
        setIsLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        const error = new Error(
          `No se pudo cargar el asset visual "${assetKey}".`
        )

        setAssetError(error.message)
        onError?.(error, event)
      }}
    />
  )
}

export default TitanBrandAsset