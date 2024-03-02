import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../oAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleAuthHandler = async () => {
    try {
      //! we take provider and project with whom it will get connected and all set.
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      console.log(data);
      navigate("/home");
    } catch (err) {
      dispatch(signInFailure(err.message));
      console.log(err);
    }
  };
  return (
    <button
      type="button"
      className="bg-red-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
      onClick={googleAuthHandler}
    >
      Continue with google
    </button>
  );
};

export default OAuth;
