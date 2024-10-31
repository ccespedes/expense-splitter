import { useForm } from "react-hook-form";
import Button from "./ui/Button";
import db, { buildDB } from "../utils/localstoragedb";
import { nanoid } from "nanoid";
import { UseDataContext } from "./context/SiteContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PlainSection from "./layout/PlainSection";
import ButtonFooter from "./ui/ButtonFooter";
import GoogleLogo from "../assets/google-logo.png";

export default function Login() {
  const { user, handleSetUser, setFriends, setGroupData, setExpenses } =
    UseDataContext();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    const id = nanoid();
    const newUser = { ...values, id };
    // onSubmit create the user in the db
    db.insert("user", newUser);
    // add new user into friends
    db.insertOrUpdate("friends", { id }, newUser);
    db.commit();
    setFriends(db.queryAll("friends"));
    // then set it into the context state
    handleSetUser(db.queryAll("user")[0].name);
  };

  useEffect(() => {
    // if user has "logged in", go to home page
    if (user) {
      navigate("/");
    }
  }, [user]);

  const populateDB = () => {
    buildDB();
    setFriends(db.queryAll("friends"));
    setGroupData(db.queryAll("groups"));
    setExpenses(db.queryAll("expenses"));
    handleSetUser(db.queryAll("user")[0].name);
  };

  return (
    <PlainSection>
      <div className="mb-5">
        <h2 className="mb-4 text-center">Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex max-w-md flex-col"
        >
          <Button
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
              placeholder="Name"
              {...register("name", { required: "name is required" })}
            />
            <div className="error-text">
              {errors.name && errors.name.message}
            </div>
          </div>

          <div className="mb-2 flex flex-col">
            <input
              placeholder="Email"
              {...register("email", { required: "email is required" })}
            />
            <div className="error-text">
              {errors.email && errors.email.message}
            </div>
          </div>

          <Button className="mx-auto mb-2 w-full min-w-28 bg-primary">
            Sign In
          </Button>
          <Button className="mx-auto mb-8 w-full min-w-28 bg-kush">
            Create Account
          </Button>
        </form>
        <ButtonFooter className="md:w-[280px]">
          <Button className="w-full min-w-28 bg-black/30" onClick={populateDB}>
            Populate Test Data
          </Button>
        </ButtonFooter>
      </div>
    </PlainSection>
  );
}
