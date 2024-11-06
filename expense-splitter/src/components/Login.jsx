import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./ui/Button";
import db, { buildDB } from "../utils/localstoragedb";
import { UseDataContext } from "./context/SiteContext";
import { useNavigate } from "react-router-dom";
import PlainSection from "./layout/PlainSection";
import ButtonFooter from "./ui/ButtonFooter";
import GoogleLogo from "../assets/google-logo.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, provider } from "../utils/firebase";

export default function Login() {
  const {
    user,
    handleSetUser,
    setFriends,
    setGroupData,
    setExpenses,
    handleTestData,
  } = UseDataContext();
  const navigate = useNavigate();
  const [actionType, setActionType] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [creds, setCreds] = useState(null);
  const [error, setError] = useState({ status: false, message: "" });

  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "An email is required" })
      .email("This is not a valid email."),
    password: z.string().min(6, { message: "Must be at least 6 characters" }),
    // name: z.string().min(1, { message: "A name is required" }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      // name: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (values) => {
    const { email, password } = values;
    console.log(email, password, actionType);
    if (actionType === "signIn") {
      signIn(email, password);
    }
    if (actionType === "signUp") {
      // prepSignup(email, password);
      signUp(email, password);
    }
  };

  const googleSignIn = async () => {
    try {
      console.log("attempting googleSignIn...");
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      const user = result.user;
      console.log("signed in. user:", user);
      handleSetUser({
        name: user.displayName,
        email: user.email,
        id: user.uid,
        photoURL: user.photoURL,
      });
      // navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("there was an error: ", errorCode, errorMessage);
    }
  };

  const signIn = async (email, password) => {
    console.log("signing in...");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("sign in successful: ", user);
      handleSetUser({
        name: user.displayName,
        email: user.email,
        id: user.uid,
      });
    } catch (error) {
      console.log(error.message);
      setError((prev) => ({ status: true, message: error.message }));
    }
  };

  const prepSignup = (email) => {
    setError({}); // clear any previous errors
    console.log("prepare sign up...");
    setIsSigningUp(true);
  };

  const nameEntered = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    console.log("name entered: ", name, creds);
    try {
      // set users display name
      updateProfile(auth.currentUser, { displayName: name });
      console.log("user display name set: ", name);
      handleSetUser({
        name: name,
        email: creds.email,
        id: creds.id,
        photoURL:
          "https://imgur.com/gallery/mixer-profile-photo-ctoasterbath-oVn60Ad",
      });
      navigate("/");
    } catch (error) {
      setError({ status: true, message: error.message });
    }
  };

  const signUp = async (email, password) => {
    console.log("hit firebase...", email, password);
    try {
      // sign the user up
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("user is signed up: ", user);
      setCreds({ email, id: user.uid });
      prepSignup();
    } catch (error) {
      console.log(error.message);
      setError({ status: true, message: error.message });
    }
  };

  useEffect(() => {
    // if user has "logged in", go to home page
    if (!isSigningUp) {
      if (user) {
        navigate("/");
      }
    }
  }, [user, isSigningUp]);

  const populateDB = () => {
    buildDB();
    setFriends(db.queryAll("friends"));
    setGroupData(db.queryAll("groups"));
    setExpenses(db.queryAll("expenses"));
    handleTestData({
      ID: 1,
      name: "Walter White",
      email: "fred@gmail.com",
      id: "EXOJIPyvbAKBvbsbESDBJ",
    });
  };

  return (
    <PlainSection>
      <div className="flexflex-col">
        <div className="relative mb-2">
          <h2 className="mb-8 text-center">
            {isSigningUp ? "Create Account" : "Login"}
          </h2>

          {isSigningUp ? (
            <form
              className="animate-fadeIn mx-auto flex max-w-md flex-col"
              onSubmit={nameEntered}
            >
              <div className="mb-2 flex flex-col">
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="text-center"
                  required
                  {...register("name", { required: true })}
                />
                <div className="error-text">
                  {error.status && error.message}
                </div>
              </div>
              <Button className="mx-auto mb-2 w-full min-w-28 bg-primary">
                Continue
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto flex max-w-md flex-col"
            >
              <div className="animate-fadeIn">
                <div className="error-text mb-2 text-center">
                  {error.status && error.message}
                </div>
                <Button
                  onClick={googleSignIn}
                  className="mx-auto mb-4 w-full min-w-28 bg-white hover:text-white"
                  textColor="text-primary/80"
                >
                  <div className="flex items-center justify-center gap-2">
                    <img className="h-6 w-6" src={GoogleLogo} />
                    <p>Sign in with Google</p>
                  </div>
                </Button>
                <div className="mb-2 flex flex-col">
                  <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    className="text-center"
                    {...register("email")}
                  />
                  <div className="error-text">
                    {errors.email && errors.email.message}
                  </div>
                </div>

                <div className="mb-2 flex flex-col">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="text-center"
                    {...register("password")}
                  />
                  <div className="error-text">
                    {errors.password && errors.password.message}
                  </div>
                </div>

                <Button
                  name="signIn"
                  onClick={() => setActionType("signIn")}
                  className="mx-auto mb-2 w-full min-w-28 bg-primary"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setActionType("signUp")}
                  className="mx-auto mb-8 w-full min-w-28 bg-kush"
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}
        </div>
        {!isSigningUp && (
          <div className="mt-auto">
            <Button
              className="w-full max-w-md bg-black/30"
              onClick={populateDB}
            >
              Populate Test Data
            </Button>
          </div>
        )}
      </div>
    </PlainSection>
  );
}
