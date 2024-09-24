import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />
    </Routes>
  </Router>
);
const App = () => {
  return (
    <div>
      <div className="absolute top-1/2 left-1/2 text-8xl text-black opacity-15 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-semibold">
        Note It!
      </div>
      <div className="relative z-10">{routes}</div>
    </div>
  );
};

export default App;
