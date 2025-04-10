import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import { FooterCom } from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Restaurants from "./pages/Restaurants";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import ScanCheckoutQR from "./pages/ScanCheckoutQR";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/checkoutqr" element={<ScanCheckoutQR />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
