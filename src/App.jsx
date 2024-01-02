import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore.jsx'
import Category from './pages/Category.jsx'
import Offers from './pages/Offers.jsx'
import Profile from './pages/Profile.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import CreateListing from "./pages/CreateListing.jsx";
import Listing from "./pages/Listing.jsx";
import Contact from "./pages/Contact.jsx";
import ForgotPassword from './pages/ForgotPassword.jsx'
import Navbar from "./components/Navbar.jsx"
import Spinner from "./components/Spinner.jsx";

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        setLoading(false)
        console.log(loggedIn)
      } else {
        setLoggedIn(false)
        setLoading(true)
      }
    })
  })

  return (
    <>
      <Router>
        <div className="flex flex-col justify-between h-screen">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/profile" element={loggedIn ? <Profile /> : <SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/category/:categoryName/:listingId" element={<Listing />} />
            <Route path="/contact/:landlordId" element={<Contact />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
