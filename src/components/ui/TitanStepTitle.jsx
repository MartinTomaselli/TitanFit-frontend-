function TitanStepTitle({
  eyebrow = '',
  title,
  subtitle = '',
  align = 'left',
  className = '',
}) {
  return (
    <header
      className={[
        'titan-step-title',
        `titan-step-title--${align}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow && (
        <p className="titan-step-title__eyebrow">
          {eyebrow}
        </p>
      )}

      <h1 className="titan-step-title__heading">
        {title}
      </h1>

      {subtitle && (
        <p className="titan-step-title__subtitle">
          {subtitle}
        </p>
      )}
    </header>
  )
}

export default TitanStepTitle