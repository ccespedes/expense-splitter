import html2pdf from "html2pdf.js";
import Button from "../ui/Button";

// Add data-html2canvas-ignore attribute to hide element

const DownloadPDF = ({ filename, contentRef }) => {
  const pdfOptions = {
    filename,
    margin: 16,
  };

  const convertToPDF = async () => {
    const content = contentRef.current;
    html2pdf().set(pdfOptions).from(content).save();
  };

  return (
    <div data-html2canvas-ignore>
      <Button
        variant="small"
        className="rounded-xl bg-primary/10 px-4 py-2 hover:bg-primary/30"
        onClick={convertToPDF}
      >
        <div className="flex items-center">
          <i
            className={`fa-solid fa-file-pdf mx-auto mr-3 text-xl text-primary/90`}
          ></i>
          <p className="text-sm text-primary">Download PDF</p>
        </div>
      </Button>
    </div>
  );
};

export default DownloadPDF;
