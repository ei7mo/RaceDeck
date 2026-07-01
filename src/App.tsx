import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RaceDetails from "./pages/RaceDetails";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/racedetails/:id" element={<RaceDetails />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
