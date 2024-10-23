import PlainSection from "./PlainSection";

const NotFound = () => {
  return (
    <PlainSection>
      <h1 className="text-center">Page Not Found</h1>
      <p className="text-center">
        The link you followed may be broken or the page may have been
        removed.&nbsp;
        <a href="/" className="text- text-primary">
          <u>Go back to the home page.</u>
        </a>
      </p>
    </PlainSection>
  );
};

export default NotFound;
