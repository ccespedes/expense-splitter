import { useForm } from "react-hook-form";
import Button from "./ui/Button";
import db, { buildDB } from "../utils/localstoragedb";
import { nanoid } from "nanoid";
import { UseDataContext } from "./context/SiteContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PlainSection from "./layout/PlainSection";
import ButtonFooter from "./ui/ButtonFooter";

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
        <h1 className="text-center">Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex max-w-md flex-col"
        >
          <div className="mb-5 flex flex-col">
            <input
              placeholder="Name"
              {...register("name", { required: "name is required" })}
            />
            <div className="error-text">
              {errors.name && errors.name.message}
            </div>
          </div>

          <div className="mb-8 flex flex-col">
            <input
              placeholder="Email"
              {...register("email", { required: "email is required" })}
            />
            <div className="error-text">
              {errors.email && errors.email.message}
            </div>
          </div>

          <Button className="mx-auto mb-8 w-full min-w-28 bg-primary">
            Get Started
          </Button>
        </form>
        <ButtonFooter className="md:w-[280px]">
          <Button
            className="w-full min-w-28 bg-orange-700"
            onClick={populateDB}
          >
            Populate Test Data
          </Button>
        </ButtonFooter>
      </div>
    </PlainSection>
  );
}
