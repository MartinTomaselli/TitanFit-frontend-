import { useEffect, useState } from 'react'
import { getExerciseMediaUrls } from '../../services/exerciseMedia'

function ExerciseMedia({
  exercise,
  className = '',
  compact = false,
}) {
  const [media, setMedia] = useState({
    thumbnailUrl: null,
    videoUrl: null,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadMedia() {
      try {
        setLoading(true)
        setError(null)

        const urls = await getExerciseMediaUrls(exercise)

        if (isMounted) {
          setMedia(urls)
        }
      } catch (loadError) {
        console.error('ExerciseMedia:', loadError)

        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMedia()

    return () => {
      isMounted = false
    }
  }, [exercise])

  if (loading) {
    return (
      <div
        className={[
          'exercise-media',
          'exercise-media--loading',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="exercise-media__placeholder">
          Cargando ejercicio...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={[
          'exercise-media',
          'exercise-media--error',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <p>No se pudo cargar el recurso visual.</p>
      </div>
    )
  }

  if (media.videoUrl) {
    return (
      <div
        className={[
          'exercise-media',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <video
         className={
          compact
          ? 'exercise-media__video exercise-media__video--compact'
          : 'exercise-media__video'
         }
          src={media.videoUrl}
          poster={media.thumbnailUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    )
  }

  if (media.thumbnailUrl) {
    return (
      <div
        className={[
          'exercise-media',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <img
         className={
          compact
          ? 'exercise-media__image exercise-media__image--compact'
          : 'exercise-media__image'
        }
          src={media.thumbnailUrl}
          alt={exercise?.display_name || 'Ejercicio TitanFit'}
        />
      </div>
    )
  }

  return (
    <div
      className={[
        'exercise-media',
        'exercise-media--empty',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p>Sin recurso visual disponible.</p>
    </div>
  )
}

export default ExerciseMedia