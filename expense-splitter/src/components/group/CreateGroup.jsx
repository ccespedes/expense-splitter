import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import db from "../../utils/localstoragedb";
import PlainSection from "../layout/PlainSection";

export default function CreateGroup() {
  const { user, friends, setGroupData } = UseDataContext();
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
    friendIDs: z.array(z.string()).optional(),
  });
  //form properties
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    // Used to check form data against validation schema
    resolver: zodResolver(schema),
  });

  //onSubmit
  const onSubmit = (values) => {
    const id = nanoid();
    //insert the new group data into the group database
    db.insert("groups", { ...values, id, expenseIDs: [] });
    db.commit();
    //call setState to render the component
    setGroupData(db.queryAll("groups"));
    //close form after submit
    // handleSetModal();
    navigate(`/groups/${id}`);
  };

  return (
    <PlainSection>
      <h2 className="text-center">Add a Group</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <label htmlFor="name" autoComplete="on" className="mb-1">
            Name
          </label>
          <input
            id="name"
            autoComplete="groupname"
            placeholder="Name your group"
            className={`border ${errors.name ? "border-red-500 outline-red-500" : "border-transparent"} `}
            {...register("name", {
              required: "description is required",
            })}
          />
          {errors.name && (
            <span className="error-text">{errors.name.message}</span>
          )}
          {/* <div className="error-text">{errors.name && errors.name.message}</div> */}
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="description" autoComplete="on" className="mb-1">
            Description
          </label>
          <input
            id="description"
            placeholder="Tell us a little bit about your group"
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
          <Button className="w-full bg-primary md:max-w-48">Submit</Button>
        </div>
      </form>
    </PlainSection>
  );
}
