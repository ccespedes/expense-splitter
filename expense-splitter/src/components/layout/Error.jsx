import { useRouteError } from "react-router-dom";
import PlainSection from "./PlainSection";

const Error = () => {
  const error = useRouteError();

  return (
    <PlainSection>
      <div className="text-center">
        <h1 className="">Page Error</h1>
        <h2 className="text-2xl font-semibold">
          Error: {error.status || error.message}
        </h2>
        <p className="">
          <a href="/" className="text-primary">
            <u>Go back to the home page.</u>
          </a>
        </p>
        <pre className="">{error.statusText}</pre>
      </div>
    </PlainSection>
  );
};

export default Error;
