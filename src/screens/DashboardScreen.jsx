import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanButton from '../components/ui/TitanButton'
import TitanProgressBar from '../components/ui/TitanProgressBar'

function DashboardScreen({
  activePlan,
  dbUser,
  sessionUser,
  fallbackName = '',
  nutritionProfile,
  selectedDayNumber,
  goalLabel,
  onStartWorkout,
  onStartCheckpoint,
}) {
  const weekNumber = activePlan?.week_number || 1
  const totalWeeks = 12
  const weeklyProgress = Math.min(
    100,
    Math.round((weekNumber / totalWeeks) * 100)
  )

  const userName =
    dbUser?.name ||
    dbUser?.nombre ||
    fallbackName ||
    'Titán'

  const supportId =
    dbUser?.id ||
    sessionUser?.id ||
    'Sin ID'

  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="w-full py-2">
          <header className="mb-7">            
            <h1 className="mt-3 text-4xl font-black leading-tight">
              Hola, {userName}
            </h1>

          </header>
          <div className="space-y-5">
            <UIBlock
              padding="medium"
              glow="strong"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: 'var(--titan-cyan)' }}
                  >
                    Entrenamiento de hoy
                  </p>

                  <h2 className="mt-3 text-3xl font-black leading-tight">
                    {goalLabel}
                  </h2>

                  <p
                    className="mt-3 text-sm font-semibold"
                    style={{ color: 'var(--titan-text-secondary)' }}
                  >
                    Duración estimada:{' '}
                    <span style={{ color: 'var(--titan-white)' }}>
                      {dbUser?.session_time || 20} min
                    </span>
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-cyan-400/30 bg-black/40 px-4 py-3 text-center">
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: 'var(--titan-text-muted)' }}
                  >
                    Día
                  </p>

                  <p
                    className="mt-1 text-2xl font-black"
                    style={{ color: 'var(--titan-cyan)' }}
                  >
                    {selectedDayNumber}
                  </p>
                </div>
              </div>

              <TitanButton
                className="mt-6"
                onClick={onStartWorkout}
              >
                Comenzar entrenamiento
              </TitanButton>
            </UIBlock>

            <UIBlock
              padding="medium"
              glow="small"
            >
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: 'var(--titan-success)' }}
              >
                Recomendación alimenticia
              </p>

              <h2 className="mt-3 text-2xl font-black">
                {nutritionProfile?.diet_type || 'Perfil nutricional'}
              </h2>

              <NutritionPieChart
                nutritionProfile={nutritionProfile}
              />

              <div className="mt-5 space-y-2">
                {nutritionProfile?.meals_per_day && (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--titan-text-secondary)' }}
                  >
                    Comidas recomendadas por día:{' '}
                    <strong style={{ color: 'var(--titan-white)' }}>
                      {nutritionProfile.meals_per_day}
                    </strong>
                  </p>
                )}

                {nutritionProfile?.fasting !== undefined &&
                  nutritionProfile?.fasting !== null && (
                    <p
                      className="text-sm"
                      style={{ color: 'var(--titan-text-secondary)' }}
                    >
                      Ayuno recomendado:{' '}
                      <strong style={{ color: 'var(--titan-white)' }}>
                        {nutritionProfile.fasting === true ||
                        nutritionProfile.fasting === 'true'
                          ? 'Sí'
                          : 'No'}
                      </strong>
                    </p>
                  )}
              </div>
            </UIBlock>

            <UIBlock
              padding="medium"
              glow="small"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: 'var(--titan-cyan)' }}
                  >
                    Progreso semanal
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Semana {weekNumber}
                  </h2>
                </div>

                <p
                  className="text-3xl font-black"
                  style={{ color: 'var(--titan-cyan)' }}
                >
                  {weeklyProgress}%
                </p>
              </div>

              <TitanProgressBar
                value={weeklyProgress}
                className="mt-5"
              />
            </UIBlock>

            <TitanButton
              variant="secondary"
              onClick={onStartCheckpoint}
            >
              Checkpoint semanal
            </TitanButton>
          </div>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

function NutritionPieChart({ nutritionProfile }) {
  const protein = nutritionProfile?.protein_pct || 0
  const carbs = nutritionProfile?.carbs_pct || 0
  const fruitsVeg = nutritionProfile?.fruits_veg_pct || 0
  const fats = nutritionProfile?.fats_pct || 0

  const proteinEnd = protein
  const carbsEnd = protein + carbs
  const fruitsVegEnd = protein + carbs + fruitsVeg
  const fatsEnd = protein + carbs + fruitsVeg + fats

  const hasNutritionData = fatsEnd > 0

  const nutritionColors = {
  protein: '#00F5FF',
  carbs: '#38BDF8',
  fruitsVeg: '#2563EB',
  fats: '#7C3AED',
}

const dividerColor = '#07131B'
const dividerSize = 1.2

const chartStyle = {
  background: hasNutritionData
    ? `conic-gradient(
        ${nutritionColors.protein} 0% ${Math.max(proteinEnd - dividerSize, 0)}%,
        ${dividerColor} ${Math.max(proteinEnd - dividerSize, 0)}% ${proteinEnd}%,

        ${nutritionColors.carbs} ${proteinEnd}% ${Math.max(carbsEnd - dividerSize, proteinEnd)}%,
        ${dividerColor} ${Math.max(carbsEnd - dividerSize, proteinEnd)}% ${carbsEnd}%,

        ${nutritionColors.fruitsVeg} ${carbsEnd}% ${Math.max(fruitsVegEnd - dividerSize, carbsEnd)}%,
        ${dividerColor} ${Math.max(fruitsVegEnd - dividerSize, carbsEnd)}% ${fruitsVegEnd}%,

        ${nutritionColors.fats} ${fruitsVegEnd}% ${Math.max(fatsEnd - dividerSize, fruitsVegEnd)}%,
        ${dividerColor} ${Math.max(fatsEnd - dividerSize, fruitsVegEnd)}% ${fatsEnd}%
      )`
    : 'conic-gradient(rgba(0, 245, 255, 0.12) 0% 100%)',
}

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="relative">
        <div
          className="h-40 w-40 rounded-full border border-cyan-300/20 shadow-xl"
          style={chartStyle}
        />

        <div className="absolute inset-8 flex items-center justify-center rounded-full bg-slate-950/95">
          <span
            className="text-xs font-black uppercase tracking-[0.14em]"
            style={{ color: 'var(--titan-text-secondary)' }}
          >
            Nutrición
          </span>
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-2">
       <NutritionLegend
  color={nutritionColors.protein}
  label="Proteínas"
  value={protein}
/>

<NutritionLegend
  color={nutritionColors.carbs}
  label="Carbohidratos"
  value={carbs}
/>

<NutritionLegend
  color={nutritionColors.fruitsVeg}
  label="Frutas/verduras"
  value={fruitsVeg}
/>

<NutritionLegend
  color={nutritionColors.fats}
  label="Grasas"
  value={fats}
/>
      </div>
    </div>
  )
}

function NutritionLegend({
  color,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-black/30 p-3">
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <span
        className="min-w-0 text-xs"
        style={{ color: 'var(--titan-text-secondary)' }}
      >
        {label}:{' '}
        <strong style={{ color: 'var(--titan-white)' }}>
          {value}%
        </strong>
      </span>
    </div>
  )
}

export default DashboardScreen