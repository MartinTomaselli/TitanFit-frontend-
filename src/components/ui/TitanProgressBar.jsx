function TitanProgressBar({
  value = 0,
  currentLabel = '',
  endLabel = '',
  className = '',
}) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div className={`titan-progress ${className}`.trim()}>
      {(currentLabel || endLabel) && (
        <div className="titan-progress__labels">
          <span>{currentLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}

      <div
        className="titan-progress__track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(safeValue)}
      >
        <div
          className="titan-progress__fill"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

export default TitanProgressBar