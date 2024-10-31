export default function Button({
  children,
  variant,
  onClick,
  className,
  type,
  disabled,
  textColor = "text-white/90",
}) {
  const baseStyles = "whitespace-nowrap";
  const buttonStyles =
    variant === "small"
      ? "py-2 px-3 rounded-md hover:bg-secondary text-sm font-light"
      : variant === "card"
        ? "py-2 px-3 rounded-md text-sm font-light"
        : "py-4 px-4 rounded-xl hover:bg-secondary font-light";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${textColor} ${buttonStyles} transition-colors ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
