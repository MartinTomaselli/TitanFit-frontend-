import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanProgressBar from '../components/ui/TitanProgressBar'
import TitanStepTitle from '../components/ui/TitanStepTitle'
import TitanOptionCard from '../components/ui/TitanOptionCard'
import TitanBottomNav from '../components/ui/TitanBottomNav'

function OnboardingScreen({
  step,
  currentStep,
  stepsLength,
  progress,
  answers,
  loadingData = false,
  onSelectAnswer,
  onPrevious,
  onNext,
}) {
  if (!step) {
    return null
  }

  const currentAnswer = answers?.[step.key] || ''
  const canContinue = Boolean(currentAnswer)

  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="flex min-h-[calc(100vh-3rem)] w-full flex-col">
          <TitanProgressBar
            value={progress}
            currentLabel={`Paso ${currentStep + 1} de ${stepsLength}`}
            endLabel={`${Math.round(progress)}%`}
          />

          <div className="flex flex-1 items-center py-8">
            <UIBlock
              padding="medium"
              glow="medium"
            >
              <TitanStepTitle
                eyebrow="Configuración inicial"
                title={step.title}
                subtitle={step.subtitle}
              />

              <div className="mt-8 space-y-3">
                {step.type === 'input' ? (
                  <input
                    value={currentAnswer}
                    onChange={(event) =>
                      onSelectAnswer(event.target.value)
                    }
                    placeholder={step.placeholder}
                    className="titan-input"
                    autoComplete={
                      step.key === 'name' ? 'name' : 'off'
                    }
                  />
                ) : (
                  step.options?.map((option) => (
                    <TitanOptionCard
                      key={option}
                      selected={currentAnswer === option}
                      onClick={() => onSelectAnswer(option)}
                    >
                      {option}
                    </TitanOptionCard>
                  ))
                )}
              </div>
            </UIBlock>
          </div>

          <TitanBottomNav
            backLabel="Atrás"
            nextLabel={
              currentStep === stepsLength - 1
                ? 'Crear mi plan'
                : 'Continuar'
            }
            nextDisabled={!canContinue}
            loading={loadingData}
            onBack={onPrevious}
            onNext={onNext}
          />
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

export default OnboardingScreen