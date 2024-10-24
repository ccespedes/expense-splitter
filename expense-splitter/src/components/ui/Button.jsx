export default function Button({
  children,
  variant,
  onClick,
  className,
  type,
  disabled,
}) {
  const baseStyles = "bg-primary whitespace-nowrap text-white";
  const buttonStyles =
    variant === "small"
      ? "py-2 px-3 rounded-md hover:bg-secondary text-sm font-light"
      : variant === "card"
        ? "py-2 px-3 rounded-md text-sm font-light"
        : "py-3 px-4 rounded-xl hover:bg-secondary font-light";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${buttonStyles} ${className} transition-colors`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
