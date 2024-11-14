import Loader from "../../assets/loader.svg";

const LoadingSpinner = () => {
  return (
    <div className="flex">
      <div className="m-auto">
        <img className="mt-20 h-full w-40" src={Loader} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
