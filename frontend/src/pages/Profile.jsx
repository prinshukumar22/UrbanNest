import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { deleteUser, getAuth } from "firebase/auth";
import { app } from "../../oAuth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(currentUser, loading, error);

  const [formData, setFormData] = useState({
    email: currentUser.email || "",
    password: "",
    username: currentUser.username || "",
    avatar: currentUser.avatar || "",
  });
  const [file, setFile] = useState(null);
  //console.log(file);

  const [progress, setProgress] = useState(0);
  //console.log(progress);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [fileUploadError, setFileUploadError] = useState(false);

  const [listings, setListings] = useState([]);

  const [listingerror, setListingerror] = useState(null);

  const fileRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    fetch(`/api/user/update/${currentUser.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { message, success } = data;
        if (!success) {
          throw new Error(message);
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(message);
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.message));
      });
  };

  const fileChangeHandler = () => {
    setFile(fileRef.current.files[0]);
  };

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  const uploadFile = (file) => {
    //! kaha store karna hai
    const storage = getStorage(app);

    //! kis naam se store karna hai
    const fileName = new Date().getTime() + file.name;

    //! storage ko file se refer karwa diya
    const storageRef = ref(storage, fileName);

    //! kitne percent uplaod kiya use check karne ke liye.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //!progress capture kar raha hu
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        //console.log(progress);
        setProgress(Math.round(progress));
      },
      () => {
        //! error catch kar raha hu
        setFileUploadError(true);
      },
      () => {
        //! jab successfully image upload hojae tab uska url le raha
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadUrl,
          }));
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const deleteHandler = () => {
    if (window.confirm("Are you sure to delete this user?")) {
      dispatch(deleteUserStart());

      const auth = getAuth(app);
      const user = auth.currentUser;

      if (user) {
        deleteUser(user)
          .then(() => {
            console.log("User account deleted.");
          })
          .catch((err) => {
            console.log(err);
          });
      }

      fetch(`/api/user/delete/${currentUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (!data.success) {
            throw new Error(data.message);
          }
          dispatch(deleteUserSuccess());
        })
        .catch((err) => {
          dispatch(deleteUserFailure(err.message));
        });
    }
  };

  const signoutHandler = () => {
    dispatch(signOutStart());
    fetch(`/api/user/signout/${currentUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success && data.message !== "Unauthorised") {
          throw new Error(data.message);
        }
        dispatch(signOutSuccess());
      })
      .catch((err) => dispatch(signOutFailure(err.message)));
  };

  const showListingsHandler = () => {
    setListingerror(false);
    fetch(`/api/listing/getlistings/${currentUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        setListings(data.listings);
      })
      .catch((err) => {
        setListingerror(err.message);
      });
  };

  const deleteListingHandler = (listing_id) => {
    setListingerror(false);
    fetch(`/api/listing/deletelisting/${listing_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setListings((listings) => {
          return listings.filter((listing) => listing._id !== listing_id);
        });
      })
      .catch((err) => setListingerror(err));
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="file"
          onChange={fileChangeHandler}
          hidden
          accept="image/*"
          ref={fileRef}
          id="avatar"
        ></input>
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile-pic"
          className="rounded-full object-cover h-20 w-20 self-center cursor-pointer"
          onClick={() => {
            fileRef.current.click();
          }}
        ></img>
        {fileUploadError ? (
          <span className="text-red-700 text-center">
            Error in uploading file.
          </span>
        ) : progress > 0 && progress < 100 ? (
          <span className="text-slate-700 text-center">{`Uploading ${progress}`}</span>
        ) : progress === 100 ? (
          <span className="text-green-700 text-center">
            Image Successfully uploaded
          </span>
        ) : (
          ""
        )}
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
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-center"
          to={"/createListing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={deleteHandler}>
          Delete account
        </span>
        <span
          className="text-green-700 cursor-pointer"
          onClick={showListingsHandler}
        >
          Show Listings
        </span>
        <span
          className="text-red-700 cursor-pointer text-center"
          onClick={signoutHandler}
        >
          Sign out
        </span>
      </div>
      {error && <p className="mt-5 text-red-700 text-center">{error}</p>}

      {listingerror && (
        <p className="mt-5 text-red-700 text-center">{listingerror}</p>
      )}

      {!error && currentUser.success && (
        <p className="mt-5 text-green-700 text-center">{updateSuccess}</p>
      )}

      {listings.length > 0 && (
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-semibold text-center mt-6">
            My Listings
          </h1>
          {listings.map((listing, idx) => {
            return (
              <div
                key={idx}
                className="flex justify-between p-3 border items-center gap-3 w-full"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    className="w-20 h-20 object-cover"
                    alt="listing-image"
                  ></img>
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <p className="font-semibold text-slate-700 flex-1 hover:underline truncate">
                    {listing.name}
                  </p>
                </Link>
                <div className="flex flex-col">
                  <button
                    type="button"
                    className=" text-red-700 rounded-lg uppercase opacity-75"
                    onClick={() => {
                      deleteListingHandler(listing._id);
                    }}
                  >
                    Delete
                  </button>
                  <Link
                    className="flex justify-center"
                    to={`/editlisting/${listing._id}`}
                  >
                    <button
                      type="button"
                      className=" text-green-700 rounded-lg uppercase opacity-75"
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
