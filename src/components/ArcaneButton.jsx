export function ArcaneButton({
  as: Component = "button",
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const composedClassName =
    `arcane-btn arcane-btn--${variant} arcane-btn--${size} ${className}`.trim();

  return (
    <Component className={composedClassName} {...props}>
      <span aria-hidden="true" className="arcane-btn__line" />
      <span aria-hidden="true" className="arcane-btn__line" />
      <span className="arcane-btn__text">{children}</span>
    </Component>
  );
}
