import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import LandingPage from "./LandingPage";
import QuantitiesPage from "./QuantitiesPage";
import FormPage from "./form/FormPage";
import ApplicationSubmitted from "./form/ApplicationSubmitted";
import Form from "./form/Form";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quantities" element={<QuantitiesPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/form1" element={<Form />} />

        <Route path="/submitted" element={<ApplicationSubmitted />} />
      </Routes>
    </BrowserRouter>
  );
}
