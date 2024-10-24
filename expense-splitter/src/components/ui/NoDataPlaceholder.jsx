import Button from "./Button";

const NoDataPlaceholder = ({ title, subtitle, btnText, onClick }) => {
  return (
    <div className="mb-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-accent/50 p-4 py-12">
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{subtitle}</p>
      <Button onClick={onClick} className="mt-4 w-full bg-primary md:max-w-64">
        {btnText}
      </Button>
    </div>
  );
};

export default NoDataPlaceholder;
