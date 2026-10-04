import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./LandingPage";
import QuantitiesPage from "./QuantitiesPage";
import FormPage from "./form/FormPage";
import ApplicationSubmitted from "./form/ApplicationSubmitted";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quantities" element={<QuantitiesPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/submitted" element={<ApplicationSubmitted />} />
      </Routes>
    </BrowserRouter>
  );
}
