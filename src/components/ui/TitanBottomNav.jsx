import TitanButton from './TitanButton'

function TitanBottomNav({
  backLabel = 'Atrás',
  nextLabel = 'Continuar',
  nextDisabled = false,
  loading = false,
  onBack,
  onNext,
  className = '',
}) {
  return (
    <div className={`titan-bottom-nav ${className}`.trim()}>
      <TitanButton
        variant="secondary"
        onClick={onBack}
      >
        {backLabel}
      </TitanButton>

      <TitanButton
        onClick={onNext}
        disabled={nextDisabled || loading}
      >
        {loading ? 'Procesando...' : nextLabel}
      </TitanButton>
    </div>
  )
}

export default TitanBottomNav