export default function IconButton({ children, icon, onClick }) {
  const iconType = `fa-${icon}`;

  return (
    <button
      tabIndex={-1}
      onClick={onClick}
      className="text-slate mx-auto flex h-[60px] w-[80px] flex-col items-center justify-center rounded-lg py-[0.16rem] transition-all hover:bg-white hover:text-primary/90"
    >
      <div>
        <i className={`fa-solid ${iconType} text-xl`}></i>
        <div className="text-[14px] font-semibold">{children}</div>
      </div>
    </button>
  );
}