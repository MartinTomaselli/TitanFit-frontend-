import TitanBrandAsset from './TitanBrandAsset'

const TITAN_LOGO_ASSET_KEY = 'titanfit_logo_primary'

function TitanLogo({
  className = '',
  alt = 'TitanFit',
}) {
  return (
    <TitanBrandAsset
      assetKey={TITAN_LOGO_ASSET_KEY}
      alt={alt}
      className={`titan-logo ${className}`.trim()}
      loadingClassName="titan-logo titan-brand-asset__placeholder"
    />
  )
}

export default TitanLogo