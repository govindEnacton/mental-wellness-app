import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import Notfound from "./components/Not-found";
import Quotes from "./components/Quotes";
import TrackMood from "./components/TrackMood";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/trackmood" element={<TrackMood />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
