import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Cities from "./pages/Cities";
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
        <Route path="/cities" element={<Cities />} />
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