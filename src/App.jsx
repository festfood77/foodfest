import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./LandingPage";
import FormPage from "./form/FormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
