import { supabase } from '../lib/supabaseClient'

const SIGNED_URL_DURATION = 60 * 60

const EXERCISE_MEDIA_BUCKETS = {
  thumbnail: 'exercise-thumbnails',
  video: 'exercise-videos',
}

export async function getExerciseMediaSignedUrl(
  mediaType,
  storagePath,
  expiresIn = SIGNED_URL_DURATION
) {
  if (!storagePath) {
    return null
  }

  const bucketName = EXERCISE_MEDIA_BUCKETS[mediaType]

  if (!bucketName) {
    throw new Error(
      `Tipo de medio no soportado: "${mediaType}".`
    )
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(storagePath, expiresIn)

  if (error) {
    throw new Error(
      `No se pudo generar la URL firmada para "${storagePath}" en "${bucketName}": ${error.message}`
    )
  }

  return data?.signedUrl || null
}

export async function getExerciseMediaUrls(exercise) {
  const thumbnailPath = exercise?.thumbnail_url || null
  const videoPath = exercise?.video_url || null

  if (videoPath) {
    const videoUrl = await getExerciseMediaSignedUrl(
      'video',
      videoPath
    )

    return {
      thumbnailUrl: null,
      videoUrl,
    }
  }

  if (thumbnailPath) {
    const thumbnailUrl = await getExerciseMediaSignedUrl(
      'thumbnail',
      thumbnailPath
    )

    return {
      thumbnailUrl,
      videoUrl: null,
    }
  }

  return {
    thumbnailUrl: null,
    videoUrl: null,
  }
}