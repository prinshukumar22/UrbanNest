import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Profile = React.lazy(() => import("./pages/Profile"));
const About = React.lazy(() => import("./pages/About"));
import Header from "./components/Header";
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));
const CreateListing = React.lazy(() => import("./pages/CreateListing"));
const EditListing = React.lazy(() => import("./pages/EditListing"));
const Listing = React.lazy(() => import("./pages/Listing"));
const Search = React.lazy(() => import("./pages/Search"));
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Suspense
        fallback={
          <p className="text-2xl text-semibold text-center my-3 text-slate-700">
            Loading...
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute></PrivateRoute>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/createListing" element={<CreateListing />}></Route>
            <Route
              path="/editlisting/:listingId"
              element={<EditListing />}
            ></Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
