import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import { useNavigate, useParams } from "react-router-dom";
import PlainSection from "../layout/PlainSection";
import LoadingSpinner from "../ui/LoadingSpinner";
import { doc, updateDoc } from "firebase/firestore";
import { db, dbGroups } from "../../utils/firebase";

export default function EditGroup() {
  const { user, friends, setGroups, groups, loadingGroups } = UseDataContext();
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if user is not logged in, go to signin
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  // Define validation schema and error messages
  const schema = z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, { message: "Must be at least 2 characters" }),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(1, { message: "Please add a description" }),
    budget: z
      .string()
      .min(1, { message: "Enter the amount please" })
      .regex(new RegExp(/^[0-9]*(.[0-9]{2})?$/, "i"), {
        message: "Please enter a valid dollar amount (e.g., 10, 10.50).",
      }),
    friendIDs: z
      .array(z.string())
      .nonempty({ message: "At least one friend ID is required" }),
  });

  //form properties
  const currentGroupData = groups.find((group) => group.id === groupId);

  console.log("currentGroupData", currentGroupData);

  //save the list of friends
  const editFriends = currentGroupData ? currentGroupData.friendIDs : [];

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({
    // Used to check form data against validation schema
    resolver: zodResolver(schema),
  });

  // if another group is selected for edit, reset the form
  useEffect(() => {
    if (currentGroupData) {
      reset({
        name: currentGroupData.name || "",
        description: currentGroupData.description || "",
        budget: currentGroupData.budget || "",
        friendIDs: currentGroupData.friendIDs || "",
      });
    }
  }, [currentGroupData, reset]);

  //onSubmit
  const onSubmit = async (values) => {
    // updating the group data in groups database
    const docRef = doc(db, dbGroups, groupId);
    await updateDoc(docRef, values);
    navigate(-1);
  };

  if (loadingGroups) {
    // Show LoadingSpinner while loading is true
    return (
      <PlainSection>
        <LoadingSpinner />
      </PlainSection>
    );
  }

  return (
    <PlainSection>
      <div className="mb-5">
        <h2 className="text-center">Edit Group</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-col">
            <label htmlFor="name" autoComplete="on" className="mb-1">
              Name
            </label>
            <input
              id="name"
              placeholder="Name"
              className={`border ${errors.name ? "border-red-500 outline-red-500" : "border-transparent"} `}
              {...register("name")}
            />
            {errors.name && (
              <span className="error-text">{errors.name.message}</span>
            )}
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="description" autoComplete="on" className="mb-1">
              Description
            </label>
            <input
              id="description"
              placeholder="What is this group about"
              className={`border ${errors.description ? "border-red-500 outline-red-500" : "border-transparent"} `}
              {...register("description")}
            />
            {errors.description && (
              <span className="error-text">{errors.description.message}</span>
            )}
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="budget" autoComplete="on" className="mb-1">
              Budget
            </label>
            <input
              id="budget"
              placeholder="Enter a value"
              className={`border ${errors.budget ? "border-red-500 outline-red-500" : "border-transparent"} `}
              {...register("budget")}
            />
            {errors.budget && (
              <span className="error-text">{errors.budget.message}</span>
            )}
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="friends" className="mr-2">
              Friends
            </label>
            <MultiSelectDropdown
              friends={friends}
              control={control}
              editFriends={editFriends}
              errors={errors.friendIDs}
            />
          </div>

          <div className="flex gap-8">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-primary/70 md:max-w-48"
            >
              Cancel
            </Button>
            <Button className="w-full bg-primary md:max-w-48">Save</Button>
          </div>
        </form>
      </div>
    </PlainSection>
  );
}
