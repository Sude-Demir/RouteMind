import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Explore from "./pages/Explore";
import PlaceDetail from "./pages/PlaceDetail";
import Trips from "./pages/Trips";
import CreateTrip from "./pages/CreateTrip";
import MyPlans from "./pages/MyPlans";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/places/:slug" element={<PlaceDetail />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/create" element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        } />
        <Route path="/my-plans" element={
          <ProtectedRoute>
            <MyPlans />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;