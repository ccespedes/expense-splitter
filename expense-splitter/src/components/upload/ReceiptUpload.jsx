import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { storage } from "../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Button from "../ui/Button";
import db from "../../utils/localstoragedb";
import { useState } from "react";

const MAX_FILE_SIZE = 6291456; // 1024 * 1024 * 6 = 6MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// Grab objects from useForm hook
const ReceiptUpload = ({ expenseDetails, setExpenses }) => {
  const [fileDetails, setFileDetails] = useState({});

  // Define validation schema
  const schema = z
    .object({
      upload: z
        .any()
        .refine(
          (file) => {
            // to display file details after selection
            setFileDetails({ name: file[0]?.name, size: file[0]?.size });
            return file[0]?.size < MAX_FILE_SIZE;
          },
          {
            message: "File size exceeded",
          },
        )
        .refine((file) => ACCEPTED_TYPES.includes(file[0]?.type), {
          message: "File type not supported",
        }),
    })
    .passthrough();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onUpload = async (data) => {
    // Define where to store with filepath
    const uploadRef = ref(
      storage,
      `${expenseDetails.id}-${data.upload[0].name}`,
    );
    // Upload to storage
    const snapshot = await uploadBytes(uploadRef, data.upload[0]);
    // Get url
    const url = await getDownloadURL(snapshot.ref);
    // save to DB
    db.update("expenses", { id: expenseDetails.id }, (expense) => {
      expense.receipt_URL = url;
      return expense;
    });
    db.commit();
    // Update state
    setExpenses(db.queryAll("expenses"));
  };

  const formatBytes = (bytes) => {
    if (typeof bytes !== "number") {
      return null;
    }

    if (bytes < 1024) {
      return `(${bytes} bytes)`;
    } else if (bytes < 1048576) {
      // 1024 * 1024
      return `(${(bytes / 1024).toFixed(2)}KB)`;
    } else {
      return `(${(bytes / 1048576).toFixed(2)}MB)`;
    }
  };

  return (
    <>
      <form
        data-html2canvas-ignore
        className="flex flex-col py-1"
        onSubmit={handleSubmit(onUpload)}
      >
        <p className="text-md font-semibold">
          Upload Receipt
          <span className="ml-2 text-sm font-light">
            (File size must be less than 6MB)
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-2 py-2">
          <label
            htmlFor="upload"
            className="flex cursor-pointer items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-light text-white transition-colors hover:bg-secondary"
          >
            <i className="fa-solid fa-paperclip mr-2"></i>Select File
          </label>
          <input
            className="absolute h-[0.1px] w-[0.1px] resize-none p-2 opacity-0"
            type="file"
            id="upload"
            {...register("upload")}
          />
          {/* Conditionally render button based on isSubmitting */}
          <Button
            variant={"small"}
            type={"submit"}
            disabled={isSubmitting || !isValid}
            className={`rounded-lg bg-primary px-6 ${isValid ? "" : "cursor-auto bg-slate-400 hover:bg-slate-400"}`}
          >
            <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
          <p>
            {fileDetails.name} {formatBytes(fileDetails.size)}
          </p>
        </div>
        {/* Render errors */}
        {errors.upload?.message && (
          <span className="text-red-500">{errors.upload.message}</span>
        )}
      </form>
    </>
  );
};

export default ReceiptUpload;
