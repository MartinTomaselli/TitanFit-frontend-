function UIBlock({
  children,
  className = '',
  contentClassName = '',
  padding = 'medium',
  glow = 'medium',
}) {
  return (
    <section
      className={[
        'titan-ui-block',
        `titan-ui-block--padding-${padding}`,
        `titan-ui-block--glow-${glow}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="titan-ui-block__corner titan-ui-block__corner--top-left"
        aria-hidden="true"
      />
      <span
        className="titan-ui-block__corner titan-ui-block__corner--top-right"
        aria-hidden="true"
      />
      <span
        className="titan-ui-block__corner titan-ui-block__corner--bottom-left"
        aria-hidden="true"
      />
      <span
        className="titan-ui-block__corner titan-ui-block__corner--bottom-right"
        aria-hidden="true"
      />

      <div
        className={[
          'titan-ui-block__content',
          contentClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  )
}

export default UIBlock