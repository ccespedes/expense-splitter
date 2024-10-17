const ButtonFooter = ({ children }) => {
  return (
    <div
      data-html2canvas-ignore
      className="over pointer-events-none fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 bg-gradient-to-t from-white to-white/0 pb-28 pt-20"
    >
      <div className="pointer-events-auto mx-auto flex gap-2">{children}</div>
    </div>
  );
};

export default ButtonFooter;
