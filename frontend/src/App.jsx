import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";

const App = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoute></PrivateRoute>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createListing" element={<CreateListing />}></Route>
          <Route
            path="/editlisting/:listingId"
            element={<EditListing />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
