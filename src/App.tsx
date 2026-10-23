import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import Notfound from "./components/Not-found";
import Quotes from "./components/Quotes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/trackmood" element={""} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
