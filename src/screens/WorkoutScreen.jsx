import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanButton from '../components/ui/TitanButton'

function WorkoutScreen({
  workoutDay,
  selectedDayNumber,
  goalLabel,
  onBack,
  onComplete,
}) {
  const warmupExercises =
    workoutDay?.exercises?.filter(
      (item) => item.block === 'warmup'
    ) || []

  const mainExercises =
    workoutDay?.exercises?.filter(
      (item) => item.block === 'main'
    ) || []

  const cooldownExercises =
    workoutDay?.exercises?.filter(
      (item) => item.block === 'cooldown'
    ) || []

  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="w-full py-2">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: 'var(--titan-text-secondary)' }}
          >
            <span aria-hidden="true">←</span>
            Volver al dashboard
          </button>

          <header className="mb-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: 'var(--titan-cyan)' }}
            >
              Día {workoutDay?.day_number || selectedDayNumber}
              {' · '}
              {goalLabel}
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight">
              Entrenamiento de hoy
            </h1>

            <p
              className="mt-4 leading-relaxed"
              style={{ color: 'var(--titan-text-secondary)' }}
            >
              Completa las tres fases: calentamiento, entrenamiento principal y vuelta a la calma.
            </p>
          </header>

          <div className="space-y-5">
            <WorkoutPhaseBlock
              phaseNumber="01"
              title="Warmup"
              subtitle="Preparación y movilidad"
              exercises={warmupExercises}
            />

            <WorkoutPhaseBlock
              phaseNumber="02"
              title="Main"
              subtitle="Entrenamiento principal"
              exercises={mainExercises}
            />

            <WorkoutPhaseBlock
              phaseNumber="03"
              title="Cooldown"
              subtitle="Recuperación y vuelta a la calma"
              exercises={cooldownExercises}
            />

            <TitanButton
              onClick={onComplete}
            >
              Marcar entrenamiento completado
            </TitanButton>
          </div>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

function WorkoutPhaseBlock({
  phaseNumber,
  title,
  subtitle,
  exercises,
}) {
  return (
    <UIBlock
      padding="medium"
      glow="small"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-black uppercase tracking-[0.18em]"
            style={{ color: 'var(--titan-cyan)' }}
          >
            Fase {phaseNumber}
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {title}
          </h2>

          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--titan-text-secondary)' }}
          >
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-cyan-400/25 bg-black/30 px-3 py-2 text-center">
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: 'var(--titan-text-muted)' }}
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

      <div className="mt-5 space-y-3">
        {exercises.length === 0 ? (
          <p
            className="rounded-2xl border border-cyan-400/10 bg-black/25 p-4 text-sm"
            style={{ color: 'var(--titan-text-secondary)' }}
          >
            No hay ejercicios cargados para esta fase.
          </p>
        ) : (
          exercises.map((item, index) => (
            <WorkoutExerciseRow
              key={item.id || `${title}-${index}`}
              item={item}
              index={index}
            />
          ))
        )}
      </div>
    </UIBlock>
  )
}

function WorkoutExerciseRow({
  item,
  index,
}) {
  const exerciseName =
    item.exercises?.display_name ||
    item.exercise_name ||
    'Ejercicio'

  const hasReps =
    item.reps !== null &&
    item.reps !== undefined

  const hasDuration =
    item.duration_sec !== null &&
    item.duration_sec !== undefined

  return (
    <article className="rounded-2xl border border-cyan-400/10 bg-black/30 p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black"
          style={{
            color: 'var(--titan-cyan)',
            borderColor: 'var(--titan-border-soft)',
            background: 'rgba(0, 245, 255, 0.06)',
          }}
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-black leading-snug">
            {exerciseName}
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <ExerciseMetric
              label="Sets"
              value={item.sets ?? '-'}
            />

            <ExerciseMetric
              label={hasReps ? 'Reps' : 'Duración'}
              value={
                hasReps
                  ? item.reps
                  : hasDuration
                    ? `${item.duration_sec}s`
                    : '-'
              }
            />

            <ExerciseMetric
              label="Descanso"
              value={
                item.rest_sec !== null &&
                item.rest_sec !== undefined
                  ? `${item.rest_sec}s`
                  : '-'
              }
            />

            <ExerciseMetric
              label="Superset"
              value={item.superset_group || '-'}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function ExerciseMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-cyan-400/10 bg-black/25 p-3">
      <span
        className="block text-xs"
        style={{ color: 'var(--titan-text-muted)' }}
      >
        {label}
      </span>

      <strong
        className="mt-1 block text-sm"
        style={{ color: 'var(--titan-white)' }}
      >
        {value}
      </strong>
    </div>
  )
}

export default WorkoutScreen