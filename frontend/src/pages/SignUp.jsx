import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        email: formData.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (!data.success) {
          setError(data.message);
          return;
        }
        setError(null);
        navigate("/signin");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg border"
          onChange={handleChange}
          value={formData.username}
        ></input>
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-4">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="mt-5 text-red-700">{error}</p>}
    </div>
  );
};

export default SignUp;
