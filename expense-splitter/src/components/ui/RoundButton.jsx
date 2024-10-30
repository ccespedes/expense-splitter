import React from "react";

const RoundButton = ({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseOut,
}) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseOut}
      onClick={onClick}
      className={`${className ? className : ""} flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm`}
    >
      {/* <div className="h-8 w-8 rounded-full bg-white/20"></div> */}
      <div className="flex h-8 w-8 items-center justify-center opacity-70 transition-all duration-300 hover:opacity-100">
        {children}
      </div>
    </button>
  );
};

export default RoundButton;
