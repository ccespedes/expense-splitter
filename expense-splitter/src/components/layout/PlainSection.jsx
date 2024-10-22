// simple section with plain top
const PlainSection = ({ children }) => {
  return (
    <div className="relative -top-[110px]">
      <div className="relative -ml-4 -mr-4">
        <div className="absolute left-1/2 h-28 w-full max-w-screen-lg -translate-x-1/2 transform rounded-t-2xl bg-gray-200"></div>
      </div>
      <div className="relative top-[20px]">{children}</div>
    </div>
  );
};

export default PlainSection;
