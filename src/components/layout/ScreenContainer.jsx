function ScreenContainer({
  children,
  className = '',
  size = 'mobile',
  center = false,
}) {
  return (
    <div
      className={[
        'titan-screen-container',
        `titan-screen-container--${size}`,
        center ? 'titan-screen-container--center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export default ScreenContainer