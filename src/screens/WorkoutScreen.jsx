import { useEffect, useMemo, useState } from 'react'

import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanButton from '../components/ui/TitanButton'
import TitanProgressBar from '../components/ui/TitanProgressBar'

import ExerciseMedia from '../components/workout/ExerciseMedia'

const WORKOUT_PHASES = [
  {
    key: 'warmup',
    number: '01',
    title: 'Warmup',
    subtitle: 'Preparación y movilidad',
  },
  {
    key: 'main',
    number: '02',
    title: 'Main',
    subtitle: 'Entrenamiento principal',
  },
  {
    key: 'cooldown',
    number: '03',
    title: 'Cooldown',
    subtitle: 'Recuperación y vuelta a la calma',
  },
]

function WorkoutScreen({
  workoutDay,
  selectedDayNumber,
  goalLabel,
  onBack,
  onComplete,
}) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)

  const phaseGroups = useMemo(() => {
    const exercises = workoutDay?.exercises || []

    return WORKOUT_PHASES.map((phase) => ({
      ...phase,
      exercises: exercises.filter(
        (item) => item.block === phase.key
      ),
    }))
  }, [workoutDay])

  useEffect(() => {
    setPhaseIndex(0)
    setExerciseIndex(0)
  }, [workoutDay?.id])

  const currentPhase =
    phaseGroups[phaseIndex] || phaseGroups[0]

  const currentExercises =
    currentPhase?.exercises || []

  const currentItem =
    currentExercises[exerciseIndex] || null

  const totalExercises = phaseGroups.reduce(
    (total, phase) => total + phase.exercises.length,
    0
  )

  const completedBeforeCurrentPhase = phaseGroups
    .slice(0, phaseIndex)
    .reduce(
      (total, phase) => total + phase.exercises.length,
      0
    )

  const completedExercisePosition =
    currentItem
      ? completedBeforeCurrentPhase + exerciseIndex + 1
      : completedBeforeCurrentPhase

  const totalProgress =
    totalExercises > 0
      ? Math.round(
          (completedExercisePosition / totalExercises) * 100
        )
      : 0

  const isFirstExercise =
    phaseIndex === 0 && exerciseIndex === 0

  const isLastExerciseInPhase =
    exerciseIndex >= currentExercises.length - 1

  const isLastPhase =
    phaseIndex >= phaseGroups.length - 1

  const isLastWorkoutExercise =
    isLastPhase && isLastExerciseInPhase

  function goToPrevious() {
    if (exerciseIndex > 0) {
      setExerciseIndex((current) => current - 1)
      return
    }

    if (phaseIndex > 0) {
      const previousPhaseIndex = phaseIndex - 1
      const previousExercises =
        phaseGroups[previousPhaseIndex]?.exercises || []

      setPhaseIndex(previousPhaseIndex)
      setExerciseIndex(
        Math.max(previousExercises.length - 1, 0)
      )
    }
  }

  function goToNext() {
    if (!isLastExerciseInPhase) {
      setExerciseIndex((current) => current + 1)
      return
    }

    if (!isLastPhase) {
      setPhaseIndex((current) => current + 1)
      setExerciseIndex(0)
      return
    }

    onComplete()
  }

  function getNextButtonLabel() {
    if (isLastWorkoutExercise) {
      return 'Completar entrenamiento'
    }

    if (isLastExerciseInPhase) {
      const nextPhase = phaseGroups[phaseIndex + 1]

      return nextPhase
        ? `Comenzar ${nextPhase.title}`
        : 'Continuar'
    }

    return 'Siguiente ejercicio'
  }

  if (!currentItem) {
    return (
      <TitanBackground>
        <ScreenContainer center>
          <UIBlock
            padding="medium"
            glow="medium"
          >
            <h1 className="text-3xl font-black">
              Entrenamiento no disponible
            </h1>

            <p
              className="mt-4 leading-relaxed"
              style={{
                color: 'var(--titan-text-secondary)',
              }}
            >
              No encontramos ejercicios cargados para este día.
            </p>

            <TitanButton
              variant="secondary"
              className="mt-6"
              onClick={onBack}
            >
              Volver al dashboard
            </TitanButton>
          </UIBlock>
        </ScreenContainer>
      </TitanBackground>
    )
  }

  const exercise =
    currentItem.exercises || {}

  const isWarmup = currentPhase.key === 'warmup'
  const isMain = currentPhase.key === 'main'
  const isCooldown = currentPhase.key === 'cooldown'

  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="w-full py-2">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
            style={{
              color: 'var(--titan-text-secondary)',
            }}
          >
            <span aria-hidden="true">←</span>
            Volver al dashboard
          </button>

          <header>
            <div className="flex items-center justify-between gap-4">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: 'var(--titan-cyan)' }}
              >
                Día {workoutDay?.day_number || selectedDayNumber}
                {' · '}
                {goalLabel}
              </p>

              <span
                className="text-xs font-bold"
                style={{
                  color: 'var(--titan-text-secondary)',
                }}
              >
                {completedExercisePosition} / {totalExercises}
              </span>
            </div>

            <TitanProgressBar
              value={totalProgress}
              className="mt-3"
            />
          </header>

          <div className="mt-6">
           {isWarmup && (
           <PhaseSummaryCard
            phase={currentPhase}
            exercises={currentExercises}
            buttonLabel="Comenzar entrenamiento principal"
            onContinue={() => {
             setPhaseIndex(1)
             setExerciseIndex(0)
          }}
        />
       )}

       {isMain && (
        <UIBlock
          padding="medium"
          glow="medium"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
            className="text-xs font-black uppercase tracking-[0.18em]"
            style={{ color: 'var(--titan-cyan)' }}
          >
            Fase {currentPhase.number}
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {currentPhase.title}
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: 'var(--titan-text-secondary)',
            }}
          >
            {currentPhase.subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-cyan-400/25 bg-black/30 px-3 py-2 text-center">
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{
              color: 'var(--titan-text-muted)',
            }}
          >
            Ejercicio
          </p>

          <p
            className="mt-1 text-xl font-black"
            style={{ color: 'var(--titan-cyan)' }}
          >
            {exerciseIndex + 1}/{currentExercises.length}
          </p>
        </div>
      </div>

      <ExerciseMedia
        exercise={exercise}
        className="mt-6"
      />

      <section className="mt-6">
        <h2 className="text-3xl font-black leading-tight">
          {exercise.display_name || 'Ejercicio'}
        </h2>

        <ExercisePrescription item={currentItem} />
      </section>
    </UIBlock>
  )}

  {isCooldown && (
    <PhaseSummaryCard
      phase={currentPhase}
      exercises={currentExercises}
      buttonLabel="Completar entrenamiento"
      onContinue={onComplete}
    />
  )}
</div>

 {isMain && (
  <div className="mt-5 grid grid-cols-2 gap-3">
    <TitanButton
      variant="secondary"
      disabled={isFirstExercise}
      onClick={goToPrevious}
    >
      Atrás
    </TitanButton>

    <TitanButton onClick={goToNext}>
      {getNextButtonLabel()}
    </TitanButton>
  </div>
)}
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

function ExercisePrescription({ item }) {
  const hasSets =
    item.sets !== null &&
    item.sets !== undefined

  const hasReps =
    item.reps !== null &&
    item.reps !== undefined

  const hasDuration =
    item.duration_sec !== null &&
    item.duration_sec !== undefined

  const hasRest =
    item.rest_sec !== null &&
    item.rest_sec !== undefined

  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <ExerciseMetric
        label="Series"
        value={hasSets ? item.sets : '—'}
      />

      <ExerciseMetric
        label={hasReps ? 'Repeticiones' : 'Duración'}
        value={
          hasReps
            ? item.reps
            : hasDuration
              ? `${item.duration_sec} s`
              : '—'
        }
      />

      <ExerciseMetric
        label="Descanso"
        value={hasRest ? `${item.rest_sec} s` : '—'}
      />

      <ExerciseMetric
        label="Superset"
        value={item.superset_group || '—'}
      />
    </div>
  )
}

function ExerciseMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-black/30 p-4">
      <span
        className="block text-xs"
        style={{ color: 'var(--titan-text-muted)' }}
      >
        {label}
      </span>

      <strong
        className="mt-1 block text-lg"
        style={{ color: 'var(--titan-white)' }}
      >
        {value}
      </strong>
    </div>
  )
}

function PhaseSummaryCard({
  phase,
  exercises,
  buttonLabel,
  onContinue,
}) {
  return (
    <UIBlock
      padding="medium"
      glow="medium"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-black uppercase tracking-[0.18em]"
            style={{ color: 'var(--titan-cyan)' }}
          >
            Fase {phase.number}
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {phase.title}
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: 'var(--titan-text-secondary)',
            }}
          >
            {phase.subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-cyan-400/25 bg-black/30 px-3 py-2 text-center">
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{
              color: 'var(--titan-text-muted)',
            }}
          >
            Ejercicios
          </p>

          <p
            className="mt-1 text-xl font-black"
            style={{ color: 'var(--titan-cyan)' }}
          >
            {exercises.length}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {exercises.map((item, index) => {
          const exercise = item.exercises || {}

          return (
            <article
              key={item.id || `${phase.key}-${index}`}
              className="flex items-center gap-4 rounded-2xl border border-cyan-400/10 bg-black/30 p-3"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-cyan-400/15 bg-black/40">
                <PhaseThumbnail exercise={exercise} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-black uppercase tracking-[0.14em]"
                  style={{ color: 'var(--titan-cyan)' }}
                >
                  Ejercicio {index + 1}
                </p>

                <h2 className="mt-1 font-black leading-snug">
                  {exercise.display_name || 'Ejercicio'}
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: 'var(--titan-text-secondary)',
                  }}
                >
                  {item.duration_sec
                    ? `${item.duration_sec} s`
                    : item.reps
                      ? `${item.reps} repeticiones`
                      : 'Completar movimiento'}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      <TitanButton
        className="mt-6"
        onClick={onContinue}
      >
        {buttonLabel}
      </TitanButton>
    </UIBlock>
  )
}

function PhaseThumbnail({ exercise }) {
  return (
    <ExerciseMedia
      exercise={exercise}
      className="h-full"
      compact
    />
  )
}

export default WorkoutScreen