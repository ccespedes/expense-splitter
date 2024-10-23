import React from "react";

const RoundButton = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${className} flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm`}
    >
      {/* <div className="h-8 w-8 rounded-full bg-white/20"></div> */}
      <div className="flex h-8 w-8 items-center justify-center">{children}</div>
    </div>
  );
};

export default RoundButton;
