const NavButton = ({ icon, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg px-4 py-2 transition-all duration-200 hover:bg-primary/10"
    >
      <li className="flex items-center">
        <i className={`fa-solid ${icon} mr-4 text-lg`}></i>
        {children}
      </li>
    </button>
  );
};

export default NavButton;
