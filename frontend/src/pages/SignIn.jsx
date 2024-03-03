import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  signInStart,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(signInStart());
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: formData.password,
        email: formData.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.success) {
          dispatch(signInFailure(data.message));
          return;
        }
        dispatch(signInSuccess(data));
        navigate("/");
      })
      .catch((err) => {
        dispatch(signInFailure(err.message));
      });
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg border"
          onChange={handleChange}
          value={formData.email}
        ></input>
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg border"
          onChange={handleChange}
          value={formData.password}
        ></input>
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth></OAuth>
      </form>
      <div className="flex gap-2 mt-4">
        <p>{"Don't Have an account?"}</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-red-700">{error}</p>}
    </div>
  );
};

export default SignIn;
