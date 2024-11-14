import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import PropTypes from "prop-types";
import PlainSection from "../layout/PlainSection";
import { db, dbFriends } from "../../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Define schema for optional email
const optionalEmail = z.union([z.string().trim().email(), z.literal("")]);
// Define validation schema and error messages
const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, { message: "Must be at least 2 characters" }),
  email: optionalEmail,
});

const FriendForm = () => {
  const params = useParams();
  // Grab data from context
  const id = params.friendId;
  const { user, friends } = UseDataContext();
  // Retrieve friend from state
  const currentFriend = friends.find((friend) => friend.id === id);
  const navigate = useNavigate();

  useEffect(() => {
    // if user is not logged in, go to signin
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  // Destructure useForm hook
  const {
    setFocus,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: currentFriend?.name,
      email: currentFriend?.email,
    },
    // Used to check form data against validation schema
    resolver: zodResolver(schema),
  });

  // Set focus on name fied on initial render
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Add friend to firestore
  const onSubmit = async (data) => {
    // if id exists, update friend
    if (id) {
      const docRef = doc(db, dbFriends, id);
      await updateDoc(docRef, data);
      console.log("friend updated");
    } else {
      // if id does not exist, add new friend
      try {
        const docRef = await addDoc(collection(db, dbFriends), {
          createdAt: serverTimestamp(),
          uid: user.id,
          ...data,
        });
        console.log("friend added, written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
    navigate("/friends");
  };

  return (
    // Pass onSubmit function to useForm submit handler
    <PlainSection>
      <h2 className="text-center">{id ? "Edit Friend" : "Add Friend"}</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          Name*
          {/* Render errors if name validation does not pass */}
          {errors.name && (
            <span className="ml-2 text-sm text-red-400">
              {errors.name.message}
            </span>
          )}
        </label>
        <input
          id="name"
          autoComplete="name"
          placeholder="Min 2 characters"
          className={`border ${errors.name ? "border-red-500 outline-red-500" : "border-transparent"} `}
          // Associate name input with useForm
          {...register("name")}
        />

        <label htmlFor="email">
          Email
          {/* Render errors if email validation does not pass */}
          {errors.email && (
            <span className="ml-2 text-sm text-red-400">
              {errors.email.message}
            </span>
          )}
        </label>
        <input
          id="email"
          autoComplete="email"
          placeholder="Optional"
          className={`border ${errors.email ? "border-red-500 outline-red-500" : "border-transparent"} `}
          // Associate email imput with useForm
          {...register("email")}
        />
        <div className="mt-3 flex gap-8">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-primary/70 md:max-w-48"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary md:max-w-48"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </PlainSection>
  );
};

// Props validation
FriendForm.propTypes = {
  id: PropTypes.string,
};

export default FriendForm;
