function TitanButton({
  children,
  type = 'button',
  variant = 'primary',
  size = 'large',
  fullWidth = true,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'titan-button',
        `titan-button--${variant}`,
        `titan-button--${size}`,
        fullWidth ? 'titan-button--full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="titan-button__label">
        {children}
      </span>
    </button>
  )
}

export default TitanButton