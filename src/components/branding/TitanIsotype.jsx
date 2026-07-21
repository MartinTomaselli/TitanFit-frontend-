import TitanBrandAsset from './TitanBrandAsset'

const TITAN_ISOTYPE_ASSET_KEY = 'titanfit_isotype_primary'

function TitanIsotype({
  className = '',
  alt = 'Isotipo de TitanFit',
}) {
  return (
    <TitanBrandAsset
      assetKey={TITAN_ISOTYPE_ASSET_KEY}
      alt={alt}
      className={`titan-isotype ${className}`.trim()}
      loadingClassName="titan-isotype titan-brand-asset__placeholder"
    />
  )
}

export default TitanIsotype