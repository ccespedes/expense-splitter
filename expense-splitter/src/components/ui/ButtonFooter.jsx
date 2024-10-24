const ButtonFooter = ({ children, className }) => {
  return (
    <div
      data-html2canvas-ignore
      className="over pointer-events-none fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 bg-gradient-to-t from-white to-white/0 pb-28 pt-20"
    >
      <div className="pointer-events-auto flex w-full px-4">
        <div
          className={`mx-auto flex w-full justify-center gap-2 ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ButtonFooter;
