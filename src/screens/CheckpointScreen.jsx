import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanProgressBar from '../components/ui/TitanProgressBar'
import TitanStepTitle from '../components/ui/TitanStepTitle'
import TitanOptionCard from '../components/ui/TitanOptionCard'
import TitanBottomNav from '../components/ui/TitanBottomNav'

function CheckpointScreen({
  checkpointQuestion,
  checkpointStep,
  questionsLength,
  checkpointProgress,
  checkpointAnswers,
  painAreas,
  onSelectAnswer,
  onTogglePainArea,
  onPrevious,
  onNext,
  onBackToDashboard,
}) {
  if (!checkpointQuestion) {
    return null
  }

  const selectedAnswer =
    checkpointAnswers?.[checkpointQuestion.key] || ''

  const showPainAreas =
    checkpointQuestion.key === 'pain' &&
    selectedAnswer &&
    selectedAnswer !== 'Ninguna molestia'

  const hasSelectedPainAreas =
    Array.isArray(checkpointAnswers?.painAreas) &&
    checkpointAnswers.painAreas.length > 0

  const canContinue =
    Boolean(selectedAnswer) &&
    (!showPainAreas || hasSelectedPainAreas)

  const isLastQuestion =
    checkpointStep === questionsLength - 1

  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="flex min-h-[calc(100vh-3rem)] w-full flex-col py-2">
          <div>
            <button
              type="button"
              onClick={onBackToDashboard}
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
              style={{
                color: 'var(--titan-text-secondary)',
              }}
            >
              <span aria-hidden="true">←</span>
              Volver al dashboard
            </button>

            <TitanProgressBar
              value={checkpointProgress}
              currentLabel={`Pregunta ${checkpointStep + 1} de ${questionsLength}`}
              endLabel={`${Math.round(checkpointProgress)}%`}
            />
          </div>

          <div className="flex flex-1 items-center py-8">
            <UIBlock
              padding="medium"
              glow="medium"
            >
              <TitanStepTitle
                eyebrow="Checkpoint semanal"
                title={checkpointQuestion.title}
                subtitle={checkpointQuestion.subtitle}
              />

              <div className="mt-8 space-y-3">
                {checkpointQuestion.options?.map((option) => (
                  <TitanOptionCard
                    key={option}
                    selected={selectedAnswer === option}
                    onClick={() => onSelectAnswer(option)}
                  >
                    {option}
                  </TitanOptionCard>
                ))}
              </div>

              {showPainAreas && (
                <section className="mt-8 border-t border-cyan-400/15 pt-7">
                  <p
                    className="text-sm font-black uppercase tracking-[0.14em]"
                    style={{ color: 'var(--titan-danger)' }}
                  >
                    ¿Dónde sentiste la molestia o dolor?
                  </p>

                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{
                      color: 'var(--titan-text-secondary)',
                    }}
                  >
                    Puedes seleccionar una o varias zonas.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {painAreas.map((area) => {
                      const selected =
                        checkpointAnswers.painAreas?.includes(
                          area.key
                        ) || false

                      return (
                        <PainAreaOption
                          key={area.key}
                          label={area.label}
                          selected={selected}
                          onClick={() =>
                            onTogglePainArea(area.key)
                          }
                        />
                      )
                    })}
                  </div>
                </section>
              )}
            </UIBlock>
          </div>

          <TitanBottomNav
            backLabel="Atrás"
            nextLabel={
              isLastQuestion
                ? 'Enviar checkpoint'
                : 'Continuar'
            }
            nextDisabled={!canContinue}
            onBack={onPrevious}
            onNext={onNext}
          />
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

function PainAreaOption({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'min-h-14 rounded-2xl border px-4 py-3 text-left text-sm font-black',
        'transition-all duration-150',
        selected
          ? 'border-red-400 bg-red-500 text-white shadow-lg'
          : 'border-cyan-400/20 bg-black/30 text-white hover:border-cyan-400/45',
      ].join(' ')}
    >
      <span className="flex items-center gap-2">
        <span
          className={[
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs',
            selected
              ? 'border-white/60 bg-white/20'
              : 'border-cyan-400/40 bg-cyan-400/5',
          ].join(' ')}
          aria-hidden="true"
        >
          {selected ? '✓' : ''}
        </span>

        <span>{label}</span>
      </span>
    </button>
  )
}

export default CheckpointScreen