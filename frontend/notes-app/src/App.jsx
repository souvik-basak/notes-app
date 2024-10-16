import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const App = () => {
  return (
    <div>
      <div className="absolute top-1/2 left-1/2 text-8xl text-black opacity-15 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-semibold">
        Note It!
      </div>
      <div className="relative z-10">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
