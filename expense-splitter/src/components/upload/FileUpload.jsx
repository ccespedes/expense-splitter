import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { storage } from "../../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const MAX_FILE_SIZE = 6000000; //6MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Define validation schema
const schema = z
  .object({
    upload: z
      .any()
      .refine((file) => file[0].size < MAX_FILE_SIZE, {
        message: "File size exceeded",
      })
      .refine((file) => ACCEPTED_TYPES.includes(file[0].type), {
        message: "File type not supported",
      }),
  })
  .passthrough();

// Grab objects from useForm hook
const FileUpload = () => {
  // Store url of uploaded image
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onUpload = async (data) => {
    // Define where to store with filepath
    // TODO - Add unique identifier to filename //
    const uploadRef = ref(storage, data.upload[0].name);
    // Upload to storage
    const snapshot = await uploadBytes(uploadRef, data.upload[0]);
    // Get url
    const url = await getDownloadURL(snapshot.ref);
    setImageUrl(url);

    reset();
  };

  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit(onUpload)}>
        <h1>Upload Receipt</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="upload">Upload File</label>
          <p className="text-sm font-light">
            (File size must be less than 6MB)
          </p>
        </div>
        <input
          className="p-2"
          type="file"
          id="upload"
          {...register("upload")}
        />
        {/* Conditionally render button based on isSubmitting */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
        {/* Render errors */}
        {errors.upload?.message && (
          <span className="text-red-500">{errors.upload.message}</span>
        )}
      </form>
      {/* Display uploaded img NOT WORKING! */}
      <img src={imageUrl} alt="" />
      {imageUrl && <a href={imageUrl}>Download</a>}
    </>
  );
};

export default FileUpload;
