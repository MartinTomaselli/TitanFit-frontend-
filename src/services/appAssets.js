import { supabase } from '../lib/supabaseClient'

const DEFAULT_SIGNED_URL_DURATION = 60 * 60

export async function getAppAssetSignedUrl(
  assetKey,
  expiresIn = DEFAULT_SIGNED_URL_DURATION
) {
  if (!assetKey) {
    throw new Error('Se requiere un assetKey para cargar el recurso.')
  }

  const { data: asset, error: assetError } = await supabase
    .from('app_assets')
    .select(`
      asset_key,
      asset_type,
      bucket_name,
      storage_path,
      alt_text,
      version,
      is_active
    `)
    .eq('asset_key', assetKey)
    .eq('is_active', true)
    .maybeSingle()

  if (assetError) {
    throw new Error(
      `No se pudo consultar el asset "${assetKey}": ${assetError.message}`
    )
  }

  if (!asset) {
    throw new Error(
      `No existe un asset activo registrado con la clave "${assetKey}".`
    )
  }

  if (!asset.bucket_name || !asset.storage_path) {
    throw new Error(
      `El asset "${assetKey}" no tiene bucket_name o storage_path válido.`
    )
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(asset.bucket_name)
    .createSignedUrl(asset.storage_path, expiresIn)

  if (signedError) {
    throw new Error(
      `No se pudo generar la URL firmada de "${assetKey}": ${signedError.message}`
    )
  }

  if (!signedData?.signedUrl) {
    throw new Error(
      `Supabase no devolvió una URL firmada para "${assetKey}".`
    )
  }

  return {
    signedUrl: signedData.signedUrl,
    altText: asset.alt_text || '',
    version: asset.version || null,
    assetType: asset.asset_type || null,
  }
}