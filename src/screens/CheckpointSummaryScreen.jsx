import TitanBackground from '../components/layout/TitanBackground'
import ScreenContainer from '../components/layout/ScreenContainer'
import UIBlock from '../components/layout/UIBlock'

import TitanButton from '../components/ui/TitanButton'

function CheckpointSummaryScreen({
  checkpointQuestions,
  checkpointAnswers,
  dataError,
  loadingData,
  onGenerateNextWeek,
}) {
  return (
    <TitanBackground>
      <ScreenContainer>
        <div className="flex min-h-[calc(100vh-3rem)] w-full flex-col justify-center py-6">
          <UIBlock
            padding="medium"
            glow="medium"
          >
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: 'var(--titan-cyan)' }}
            >
              Checkpoint completado
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight">
              Tu próxima semana está lista para generarse.
            </h1>

            <p
              className="mt-4 leading-relaxed"
              style={{
                color: 'var(--titan-text-secondary)',
              }}
            >
              TitanFit utilizará tus respuestas para ajustar la intensidad,
              proteger tus zonas sensibles y adaptar tu siguiente semana.
            </p>

            <div className="mt-8 space-y-3">
              {checkpointQuestions.map((item) => (
                <SummaryItem
                  key={item.key}
                  label={item.title}
                  value={
                    checkpointAnswers[item.key] ||
                    'Sin respuesta'
                  }
                />
              ))}
            </div>

            {Array.isArray(checkpointAnswers.painAreas) &&
              checkpointAnswers.painAreas.length > 0 && (
                <SummaryItem
                  className="mt-3"
                  label="Zonas con molestias"
                  value={checkpointAnswers.painAreas.join(', ')}
                />
              )}

            {dataError && (
              <div className="mt-6 rounded-2xl border border-red-400/60 bg-red-950/60 p-4 text-sm text-red-100">
                {dataError}
              </div>
            )}

            <TitanButton
              className="mt-8"
              disabled={loadingData}
              onClick={onGenerateNextWeek}
            >
              {loadingData
                ? 'Generando nueva semana...'
                : 'Generar siguiente semana'}
            </TitanButton>
          </UIBlock>
        </div>
      </ScreenContainer>
    </TitanBackground>
  )
}

function SummaryItem({
  label,
  value,
  className = '',
}) {
  return (
    <article
      className={[
        'rounded-2xl border border-cyan-400/15 bg-black/30 p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p
        className="text-xs font-black uppercase tracking-[0.14em]"
        style={{ color: 'var(--titan-text-muted)' }}
      >
        {label}
      </p>

      <p
        className="mt-2 font-black leading-relaxed"
        style={{ color: 'var(--titan-white)' }}
      >
        {value}
      </p>
    </article>
  )
}

export default CheckpointSummaryScreen